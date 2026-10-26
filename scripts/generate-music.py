"""Original soft instrumental for the wedding invitation.

This is not a commercial recording. It is a short, generated piece in D major:
a slow original pentatonic melody over sustained chords, safe to loop.
"""

import math
import struct
import wave

SAMPLE_RATE = 22050
DURATION = 32.0
TOTAL = int(SAMPLE_RATE * DURATION)


def midi(note: float) -> float:
    return 440.0 * (2.0 ** ((note - 69.0) / 12.0))


def envelope(t: float, length: float, attack: float, release: float) -> float:
    if t < 0.0 or t > length:
        return 0.0
    attack_gain = min(1.0, t / attack) if attack else 1.0
    release_gain = min(1.0, (length - t) / release) if release else 1.0
    return attack_gain * release_gain


samples = [0.0] * TOTAL

# Original 8-bar phrase at 60 bpm. Each pair is (midi note, start second, length).
melody = [
    (74, 0.4, 1.8),
    (78, 2.4, 1.6),
    (81, 4.2, 1.8),
    (78, 6.2, 1.5),
    (79, 8.3, 1.7),
    (83, 10.2, 1.6),
    (74, 12.2, 1.8),
    (71, 14.2, 1.5),
    (69, 16.4, 1.6),
    (73, 18.3, 1.7),
    (76, 20.2, 1.8),
    (73, 22.2, 1.4),
    (74, 24.2, 1.8),
    (69, 26.3, 1.5),
    (66, 28.2, 1.6),
    (62, 30.0, 1.7),
]

for note, start, length in melody:
    frequency = midi(note)
    begin = int(start * SAMPLE_RATE)
    end = min(TOTAL, int((start + length) * SAMPLE_RATE))
    for index in range(begin, end):
        time = index / SAMPLE_RATE - start
        gain = envelope(time, length, 0.03, 0.45)
        tone = math.sin(2 * math.pi * frequency * time)
        overtone = math.sin(2 * math.pi * frequency * 2 * time)
        samples[index] += (tone * 0.22 + overtone * 0.05) * gain

chords = [
    (0.0, 8.0, (50, 57, 62, 66, 69)),
    (8.0, 8.0, (55, 59, 62, 67, 71)),
    (16.0, 8.0, (57, 64, 69, 73, 76)),
    (24.0, 8.0, (50, 57, 62, 66, 74)),
]

for start, length, notes in chords:
    begin = int(start * SAMPLE_RATE)
    end = min(TOTAL, int((start + length) * SAMPLE_RATE))
    for index in range(begin, end):
        time = index / SAMPLE_RATE - start
        gain = envelope(time, length, 1.1, 1.3)
        pad = 0.0
        for note in notes:
            frequency = midi(note)
            pad += math.sin(2 * math.pi * frequency * time)
            pad += 0.3 * math.sin(2 * math.pi * frequency * 1.003 * time)
        samples[index] += pad * 0.018 * gain

# One quiet delayed copy softens the melody without sounding like a stadium.
delayed = samples[:]
offset = int(0.22 * SAMPLE_RATE)
for index in range(offset, TOTAL):
    samples[index] += delayed[index - offset] * 0.18

fade = int(0.08 * SAMPLE_RATE)
for index in range(fade):
    samples[index] *= index / fade
    samples[TOTAL - 1 - index] *= index / fade

peak = max(abs(sample) for sample in samples) or 1.0
scale = 0.52 / peak

with wave.open("public/assets/background-music.wav", "w") as handle:
    handle.setnchannels(1)
    handle.setsampwidth(2)
    handle.setframerate(SAMPLE_RATE)
    frames = bytearray()
    for sample in samples:
        value = max(-1.0, min(1.0, sample * scale))
        frames += struct.pack("<h", int(value * 32767))
    handle.writeframes(frames)

print(f"wrote {TOTAL} samples, peak normalised")
