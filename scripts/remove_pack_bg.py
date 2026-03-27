#!/usr/bin/env python3
"""Remove light grey / white background connected to image corners (RGBA PNG)."""
from __future__ import annotations

import math
import sys
from collections import deque

from PIL import Image


def dist3(a: tuple[int, int, int], b: tuple[float, float, float]) -> float:
    return math.sqrt(
        (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
    )


def erode_fg_8(
    fg: list[list[bool]], w: int, h: int
) -> list[list[bool]]:
    """One step: keep pixel only if self + all 8 neighbours are foreground."""
    out = [[False] * h for _ in range(w)]
    for y in range(h):
        for x in range(w):
            if not fg[x][y]:
                continue
            keep = True
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    nx, ny = x + dx, y + dy
                    if nx < 0 or nx >= w or ny < 0 or ny >= h or not fg[nx][ny]:
                        keep = False
                        break
                if not keep:
                    break
            out[x][y] = keep
    return out


def erode_object_n(
    fg: list[list[bool]], w: int, h: int, iterations: int
) -> list[list[bool]]:
    for _ in range(max(0, iterations)):
        fg = erode_fg_8(fg, w, h)
    return fg


def main() -> None:
    if len(sys.argv) < 3:
        print(
            "Usage: remove_pack_bg.py <input.png> <output.png> "
            "[tolerance] [erode_px]"
        )
        print("  erode_px: shrink object mask by N pixels (8-neighbour), default 1")
        sys.exit(1)
    inp, outp = sys.argv[1], sys.argv[2]
    tol = float(sys.argv[3]) if len(sys.argv) > 3 else 42.0
    erode_px = int(sys.argv[4]) if len(sys.argv) > 4 else 1

    img = Image.open(inp).convert("RGBA")
    w, h = img.size
    px = img.load()

    def rgb_at(x: int, y: int) -> tuple[int, int, int]:
        r, g, b, _ = px[x, y]
        return (r, g, b)

    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    cr = sum(rgb_at(x, y)[0] for x, y in seeds) / 4.0
    cg = sum(rgb_at(x, y)[1] for x, y in seeds) / 4.0
    cb = sum(rgb_at(x, y)[2] for x, y in seeds) / 4.0
    ref = (cr, cg, cb)

    def close(rgb: tuple[int, int, int]) -> bool:
        return dist3(rgb, ref) <= tol

    removed = [[False] * h for _ in range(w)]
    q: deque[tuple[int, int]] = deque()

    for sx, sy in seeds:
        if close(rgb_at(sx, sy)):
            q.append((sx, sy))
            removed[sx][sy] = True

    while q:
        x, y = q.popleft()
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if nx < 0 or nx >= w or ny < 0 or ny >= h or removed[nx][ny]:
                    continue
                if close(rgb_at(nx, ny)):
                    removed[nx][ny] = True
                    q.append((nx, ny))

    fg = [[not removed[x][y] for y in range(h)] for x in range(w)]
    fg = erode_object_n(fg, w, h, erode_px)

    out = Image.new("RGBA", (w, h))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if removed[x][y] or not fg[x][y]:
                opx[x, y] = (0, 0, 0, 0)
            else:
                opx[x, y] = (r, g, b, a)

    out.save(outp, optimize=True)
    print("Saved:", outp, f"(erode_px={erode_px})")


if __name__ == "__main__":
    main()
