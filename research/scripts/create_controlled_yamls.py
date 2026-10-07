from pathlib import Path

tud = Path(r"C:\PEP_2026\controlled_tud_only.yaml")
tud.write_text(
"""path: C:/PEP_2026/dataset
train: images/train
val: images/val
test: images/test
names:
  0: floating_waste
""",
encoding="utf-8"
)

iwhr = Path(r"C:\PEP_2026\controlled_iwhr_only.yaml")
iwhr.write_text(
"""path: C:/PEP_2026/iwhr_adaptation
train: images/train
val: images/val
test: images/test
names:
  0: floating_waste
""",
encoding="utf-8"
)

print("Created:")
print(tud)
print(iwhr)
