#!/usr/bin/env bash
#
# Strict acceptance gate for the eight private Football Manager calibration
# saves.
#
# `cargo test --release --lib` on its own reports a green suite whether or not
# the saves exist: without them nine fixture-dependent tests print `SKIPPED …`
# and return success, so "96 passed" says nothing about the read-only guarantee
# or about any club resolving correctly. This script is the check that cannot
# pass vacuously. It:
#
#   * requires SCOUTIQ_TEST_SAVES and a directory that really holds the saves;
#   * requires exactly eight `.fm` files;
#   * records size, mtime and SHA-256 of every save before anything runs;
#   * runs the suite with SCOUTIQ_TEST_SAVES_STRICT=1, which turns every skip
#     into a failure;
#   * fails if any test still printed SKIPPED;
#   * requires one CALIBRATION-OK line per scenario, VVV-Venlo included;
#   * re-checks size, mtime and SHA-256 afterwards and fails on any drift.
#
# The saves are client data. This script only ever reads them: no edit, rename,
# move, truncate, chmod or touch, and nothing is copied into the repository.
#
# Usage:
#   SCOUTIQ_TEST_SAVES=/mnt/storage/veytaro-test-saves scripts/verify-fm-saves.sh
#
# Exit status is 0 only when every check above passed.

set -Eeuo pipefail

readonly EXPECTED_COUNT=8

# Scenario slugs printed by
# `live_save_tests::the_eight_calibration_scenarios_are_all_present`. Each is
# matched on the resolved (club uid, competition uid, trailer date) — never on a
# filename, so the saves may be named anything.
readonly EXPECTED_SLUGS=(
	bayer-leverkusen
	msv-duisburg
	tsv-1860-muenchen
	vvv-venlo
	salford
	macclesfield-league-one
	macclesfield-promotion-won
	macclesfield-championship
)

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_DIR="$(dirname -- "$SCRIPT_DIR")"
readonly CARGO_DIR="$REPO_DIR/src-tauri"

failures=0
step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
ok() { printf '   \033[32mOK\033[0m   %s\n' "$*"; }
bad() {
	printf '   \033[31mFAIL\033[0m %s\n' "$*"
	failures=$((failures + 1))
}
die() {
	printf '\n\033[31mABORT\033[0m %s\n' "$*" >&2
	exit 2
}

# ---------------------------------------------------------------------------
step "1/7  Fixture directory"

[[ -n "${SCOUTIQ_TEST_SAVES:-}" ]] ||
	die "SCOUTIQ_TEST_SAVES is not set. Point it at the directory holding the eight .fm saves."
[[ -d "$SCOUTIQ_TEST_SAVES" ]] ||
	die "SCOUTIQ_TEST_SAVES=$SCOUTIQ_TEST_SAVES is not a directory."

SAVES_DIR="$(cd -- "$SCOUTIQ_TEST_SAVES" && pwd -P)"
readonly SAVES_DIR

# The saves must never end up staged, committed or pushed. Anything inside the
# working tree is one `git add -A` away from that, so refuse outright.
case "$SAVES_DIR/" in
"$REPO_DIR"/*)
	die "$SAVES_DIR is inside the repository. Keep the saves outside the working tree — they are client data and must never be committed."
	;;
esac
ok "$SAVES_DIR (outside the repository)"

# ---------------------------------------------------------------------------
step "2/7  Exactly $EXPECTED_COUNT .fm files"

mapfile -d '' -t SAVE_PATHS < <(
	find "$SAVES_DIR" -maxdepth 1 -type f -iname '*.fm' -print0 | sort -z
)
count=${#SAVE_PATHS[@]}

for p in "${SAVE_PATHS[@]}"; do
	printf '   %14s bytes  %s\n' "$(stat -c '%s' -- "$p")" "$(basename -- "$p")"
done

if ((count == EXPECTED_COUNT)); then
	ok "$count .fm files"
else
	bad "found $count .fm files, expected $EXPECTED_COUNT"
	die "Refusing to run the suite against an incomplete calibration set — a partial set still reports every other test as passing."
fi

for p in "${SAVE_PATHS[@]}"; do
	[[ -r "$p" ]] || bad "not readable: $p"
done
((failures == 0)) || die "The parser needs read access and nothing more."

# ---------------------------------------------------------------------------
step "3/7  Pre-test evidence"

WORK_DIR="$(mktemp -d -t veytaro-fm-verify-XXXXXX)"
readonly WORK_DIR
trap 'printf "\nEvidence kept in %s\n" "$WORK_DIR"' EXIT

before_stat="$WORK_DIR/before-stat.txt"
before_sha="$WORK_DIR/before-sha256.txt"
after_stat="$WORK_DIR/after-stat.txt"
after_sha="$WORK_DIR/after-sha256.txt"
test_log="$WORK_DIR/test.log"

printf '%s\0' "${SAVE_PATHS[@]}" | xargs -0 stat -c '%n|%s|%Y' | sort >"$before_stat"
printf '%s\0' "${SAVE_PATHS[@]}" | xargs -0 sha256sum >"$before_sha"
cat "$before_sha"
ok "size, mtime and SHA-256 recorded for $count saves"

# ---------------------------------------------------------------------------
step "4/7  Real-save test suite (strict)"

# SCOUTIQ_TEST_SAVES_STRICT=1 turns every "fixture missing" skip into a test
# failure, so a save that is absent, unreadable or unexpected cannot be reported
# as a pass. Ordinary CI leaves the variable unset and keeps working without the
# private saves.
set +e
(
	cd "$CARGO_DIR" &&
		SCOUTIQ_TEST_SAVES="$SAVES_DIR" \
			SCOUTIQ_TEST_SAVES_STRICT=1 \
			cargo test --release --lib -- --nocapture
) 2>&1 | tee "$test_log"
cargo_status=${PIPESTATUS[0]}
set -e

if ((cargo_status == 0)); then
	ok "cargo test exited 0"
else
	bad "cargo test exited $cargo_status"
fi

if grep -q 'SKIPPED' "$test_log"; then
	bad "a test printed SKIPPED — it did no work:"
	grep -n 'SKIPPED' "$test_log" | sed 's/^/        /'
else
	# Deliberately does not contain the literal skip marker: this script's own
	# output is normally tee'd to a log that is then grepped for it, and a
	# success message that matches the failure pattern is worse than useless.
	ok "no skip markers in the cargo output"
fi

if result_line=$(grep -m1 '^test result:' "$test_log"); then
	printf '   %s\n' "$result_line"
fi

# ---------------------------------------------------------------------------
step "5/7  Scenario coverage"

for slug in "${EXPECTED_SLUGS[@]}"; do
	if line=$(grep -m1 -F "CALIBRATION-OK $slug " "$test_log"); then
		ok "${line#*CALIBRATION-OK }"
	else
		bad "scenario '$slug' was not resolved from any save"
	fi
done

seen=$(grep -c 'CALIBRATION-OK ' "$test_log" || true)
if [[ "$seen" == "$EXPECTED_COUNT" ]]; then
	ok "$seen of $EXPECTED_COUNT scenarios covered"
else
	bad "$seen scenarios covered, expected $EXPECTED_COUNT"
fi

# ---------------------------------------------------------------------------
step "6/7  Saves unchanged"

printf '%s\0' "${SAVE_PATHS[@]}" | xargs -0 stat -c '%n|%s|%Y' | sort >"$after_stat"
printf '%s\0' "${SAVE_PATHS[@]}" | xargs -0 sha256sum >"$after_sha"

if diff -u "$before_stat" "$after_stat"; then
	ok "size and modification time unchanged"
else
	bad "size or modification time changed"
fi

if diff -u "$before_sha" "$after_sha"; then
	ok "SHA-256 unchanged"
else
	bad "SHA-256 changed — a save was rewritten"
fi

if sha256sum -c --quiet "$before_sha"; then
	ok "every save verifies against its pre-test checksum"
else
	bad "checksum verification failed"
fi

# ---------------------------------------------------------------------------
step "7/7  Result"

if ((failures == 0)); then
	printf '   \033[32mPASS\033[0m  %d saves parsed, %d scenarios covered, all byte-identical afterwards.\n' \
		"$count" "$EXPECTED_COUNT"
	exit 0
fi

printf '   \033[31mFAIL\033[0m  %d check(s) failed.\n' "$failures"
exit 1
