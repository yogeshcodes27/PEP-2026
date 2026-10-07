from llm import generate_answer

context = """
PROJECT:
RobustFloat is a floating-waste detection system for inland waters.

CURRENT PRIMARY MODEL:
YOLO26s-P2 Unified.

TUD-GV TEST:
Precision = 97.32%
Recall = 90.37%
F1 = 93.72%
mAP50 = 93.60%
mAP50-95 = 71.99%

IWHR TEST:
Precision = 86.61%
Recall = 68.76%
F1 = 76.66%
mAP50 = 73.48%
mAP50-95 = 51.78%

LIMITATION:
Performance on a completely unseen third water-domain dataset
has not been established.
"""

result = generate_answer(
    "What is the recall of the final model on IWHR?",
    context
)

print("\n" + "=" * 60)
print("ROBUSTFLOAT | GROQ TEST")
print("=" * 60)

print("Model:", result["model"])
print("\nAnswer:")
print(result["answer"])

print("\nToken usage:")
print("Input :", result["input_tokens"])
print("Output:", result["output_tokens"])
print("Total :", result["total_tokens"])
print("=" * 60)
