#!/bin/sh
# diffai installer
# Usage: curl https://joshfinnie.com/diffai/install.sh | sh
#
# Environment variables:
#   DIFFAI_VERSION   — pin a specific release (e.g. v0.1.0); defaults to latest
#   DIFFAI_INSTALL   — install directory; defaults to /usr/local/bin or ~/.local/bin

set -e

BASE_URL="https://joshfinnie.com/diffai"
BINARY="diffai"

# ── Resolve version ────────────────────────────────────────────────────────────

if [ -z "$DIFFAI_VERSION" ]; then
    DIFFAI_VERSION=$(curl -fsSL "$BASE_URL/version.txt") || {
        echo "error: could not fetch latest version from $BASE_URL/version.txt" >&2
        exit 1
    }
    DIFFAI_VERSION=$(echo "$DIFFAI_VERSION" | tr -d '[:space:]')
fi

# ── Detect platform ────────────────────────────────────────────────────────────

OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
    Linux)
        case "$ARCH" in
            x86_64)  TARGET="x86_64-unknown-linux-gnu" ;;
            aarch64|arm64) TARGET="aarch64-unknown-linux-gnu" ;;
            *)
                echo "error: unsupported Linux architecture: $ARCH" >&2
                exit 1
                ;;
        esac
        ;;
    Darwin)
        case "$ARCH" in
            arm64) TARGET="aarch64-apple-darwin" ;;
            x86_64)
                if ! /usr/bin/arch -arch arm64 true 2>/dev/null; then
                    echo "error: Intel Mac detected and Rosetta 2 is not available." >&2
                    echo "       Pre-built binaries are ARM64-only. Build from source:" >&2
                    echo "       https://github.com/joshfinnie/diffai" >&2
                    exit 1
                fi
                TARGET="aarch64-apple-darwin"
                echo "note: Intel Mac detected — installing ARM64 binary (runs via Rosetta 2)"
                ;;
            *)
                echo "error: unsupported macOS architecture: $ARCH" >&2
                exit 1
                ;;
        esac
        ;;
    *)
        echo "error: unsupported OS: $OS" >&2
        exit 1
        ;;
esac

# ── Resolve install directory ──────────────────────────────────────────────────

if [ -z "$DIFFAI_INSTALL" ]; then
    if [ -w "/usr/local/bin" ]; then
        DIFFAI_INSTALL="/usr/local/bin"
    else
        DIFFAI_INSTALL="$HOME/.local/bin"
        mkdir -p "$DIFFAI_INSTALL"
    fi
fi

# ── Download ───────────────────────────────────────────────────────────────────

DOWNLOAD_URL="$BASE_URL/$DIFFAI_VERSION/diffai-$TARGET"
CHECKSUM_URL="$BASE_URL/$DIFFAI_VERSION/checksums-$TARGET.txt"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Downloading diffai $DIFFAI_VERSION ($TARGET)..."
curl -fsSL "$DOWNLOAD_URL" -o "$TMP_DIR/$BINARY"

# ── Verify checksum ────────────────────────────────────────────────────────────

echo "Verifying checksum..."
curl -fsSL "$CHECKSUM_URL" -o "$TMP_DIR/checksums.txt"

EXPECTED=$(grep "diffai-$TARGET" "$TMP_DIR/checksums.txt" | awk '{ print $1 }')

if [ -z "$EXPECTED" ]; then
    echo "error: could not find checksum for diffai-$TARGET" >&2
    exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
    ACTUAL=$(sha256sum "$TMP_DIR/$BINARY" | awk '{ print $1 }')
elif command -v shasum >/dev/null 2>&1; then
    ACTUAL=$(shasum -a 256 "$TMP_DIR/$BINARY" | awk '{ print $1 }')
else
    echo "warning: no sha256 tool found, skipping checksum verification"
    ACTUAL="$EXPECTED"
fi

if [ "$ACTUAL" != "$EXPECTED" ]; then
    echo "error: checksum mismatch" >&2
    echo "  expected: $EXPECTED" >&2
    echo "  actual:   $ACTUAL" >&2
    exit 1
fi

# ── Install ────────────────────────────────────────────────────────────────────

chmod +x "$TMP_DIR/$BINARY"
mv "$TMP_DIR/$BINARY" "$DIFFAI_INSTALL/$BINARY"

echo "Installed diffai $DIFFAI_VERSION to $DIFFAI_INSTALL/$BINARY"

case ":$PATH:" in
    *":$DIFFAI_INSTALL:"*) ;;
    *)
        echo ""
        echo "note: $DIFFAI_INSTALL is not in your PATH."
        echo "      Add this to your shell profile:"
        echo "        export PATH=\"$DIFFAI_INSTALL:\$PATH\""
        ;;
esac
