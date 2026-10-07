from rag.context_builder import build_context
from llm import generate_answer


question = "What is the recall of the final model on IWHR and why is performance lower there?"

context = build_context(question)

print("\n" + "=" * 80)
print("ROBUSTFLOAT | GENERATED CONTEXT")
print("=" * 80)
print(context)

result = generate_answer(
    question,
    context,
)

print("\n" + "=" * 80)
print("ROBUSTFLOAT | GROUNDED ANSWER")
print("=" * 80)
print(result["answer"])

print("\n" + "=" * 80)
print("TOKEN USAGE")
print("=" * 80)
print("Input :", result["input_tokens"])
print("Output:", result["output_tokens"])
print("Total :", result["total_tokens"])