from pathlib import Path
import random

TUD_TRAIN = Path(r"C:\PEP_2026\dataset\images\train")
TUD_VAL   = Path(r"C:\PEP_2026\dataset\images\val")
TUD_TEST  = Path(r"C:\PEP_2026\dataset\images\test")

IWHR_TRAIN = Path(r"C:\PEP_2026\iwhr_adaptation\images\train")
IWHR_VAL   = Path(r"C:\PEP_2026\iwhr_adaptation\images\val")
IWHR_TEST  = Path(r"C:\PEP_2026\iwhr_adaptation\images\test")

OUT = Path(r"C:\PEP_2026\unified_dataset")
OUT.mkdir(parents=True, exist_ok=True)

random.seed(42)

tud_train = sorted(TUD_TRAIN.glob("*.jpg"))
iwhr_train = sorted(IWHR_TRAIN.glob("*.jpg"))

tud_val = sorted(TUD_VAL.glob("*.jpg"))
iwhr_val = sorted(IWHR_VAL.glob("*.jpg"))

tud_test = sorted(TUD_TEST.glob("*.jpg"))
iwhr_test = sorted(IWHR_TEST.glob("*.jpg"))

# Keep every TUD image at least once, then oversample TUD
# until its effective training exposure matches IWHR.
target = len(iwhr_train)

extra_needed = target - len(tud_train)

extra_tud = random.choices(tud_train, k=extra_needed)

balanced_tud = tud_train + extra_tud
random.shuffle(balanced_tud)

train_list = balanced_tud + iwhr_train
random.shuffle(train_list)

val_list = tud_val + iwhr_val
test_list = tud_test + iwhr_test

def write_list(path, items):
    with path.open("w", encoding="utf-8") as f:
        for item in items:
            f.write(str(item.resolve()) + "\n")

write_list(OUT / "train_balanced.txt", train_list)
write_list(OUT / "val_combined.txt", val_list)
write_list(OUT / "test_combined.txt", test_list)

# Separate validation/test lists for domain-specific evaluation later.
write_list(OUT / "tud_val.txt", tud_val)
write_list(OUT / "iwhr_val.txt", iwhr_val)
write_list(OUT / "tud_test.txt", tud_test)
write_list(OUT / "iwhr_test.txt", iwhr_test)

yaml = f"""path: C:/PEP_2026/unified_dataset
train: C:/PEP_2026/unified_dataset/train_balanced.txt
val: C:/PEP_2026/unified_dataset/val_combined.txt
test: C:/PEP_2026/unified_dataset/test_combined.txt

names:
  0: floating_waste
"""

(OUT / "dataset.yaml").write_text(yaml, encoding="utf-8")

print("========== UNIFIED DATASET ==========")
print(f"TUD unique train images:       {len(tud_train)}")
print(f"TUD extra sampled entries:     {len(extra_tud)}")
print(f"TUD effective train entries:   {len(balanced_tud)}")
print(f"IWHR unique train images:      {len(iwhr_train)}")
print(f"Effective train entries:       {len(train_list)}")
print()
print(f"TUD validation:                {len(tud_val)}")
print(f"IWHR validation:               {len(iwhr_val)}")
print(f"Combined validation:           {len(val_list)}")
print()
print(f"TUD test:                      {len(tud_test)}")
print(f"IWHR test:                     {len(iwhr_test)}")
print(f"Combined test:                 {len(test_list)}")
print()
print("Class: 0 = floating_waste")
print(f"Output: {OUT}")
