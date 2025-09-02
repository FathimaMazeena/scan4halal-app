from itertools import combinations, product
import json
import csv
import random
from sklearn.model_selection import train_test_split

with open("nlp/ingredient_synonyms.json", "r") as f:
    ingredients = json.load(f)

pairs = []

# Positive pairs
for key, synonyms in ingredients.items():
    for a, b in combinations(synonyms, 2):  # All combinations within one ingredient
        pairs.append((a, b, 1))  # label 1 = similar
    for synonym in synonyms:
        pairs.append((key, synonym, 1))  # code ↔ synonym
        

# Negative pairs
keys = list(ingredients.keys())
for i in range(len(keys)):
    for j in range(i+1, len(keys)):
        for a in ingredients[keys[i]]:
            for b in ingredients[keys[j]]:
                pairs.append((a, b, 0))  # label 0 = not similar

# with open("nlp/training_data.csv", "w", newline="", encoding="utf-8") as f:
#     writer = csv.writer(f)
#     writer.writerow(["text1", "text2", "label"])  # header
#     writer.writerows(pairs)

# print("Pairs saved to nlp/training_pairs.csv")

print(f"Total pairs before downsampling: {len(pairs)}")

# Separate positives and negatives
positives = [pair for pair in pairs if pair[2] == 1]
negatives = [pair for pair in pairs if pair[2] == 0]

# Downsample negatives to match positives
negatives_downsampled = random.sample(negatives, len(positives))

# Combine again
balanced_pairs = positives + negatives_downsampled
random.shuffle(balanced_pairs)

print(f"Total pairs: {len(balanced_pairs)}")
print(f"Positive: {len(positives)}, Negative: {len(negatives_downsampled)}")

# with open("nlp/training_data_balanced.csv", "w", newline="", encoding="utf-8") as f:
#     writer = csv.writer(f)
#     writer.writerow(["text1", "text2", "label"])  # header
#     writer.writerows(balanced_pairs)

# print("Pairs saved to nlp/training_pairs.csv")

# Split into train/test sets
# train_pairs, test_pairs = train_test_split(balanced_pairs, test_size=0.2, random_state=42)

# print(f"Train pairs: {len(train_pairs)}, Test pairs: {len(test_pairs)}")


# with open("training_data_splitted.csv", "w", newline="", encoding="utf-8") as f:
#     writer = csv.writer(f)
#     writer.writerow(["term1", "term2", "label"])
#     writer.writerows(train_pairs + test_pairs)  # Or separate train/test CSVs


