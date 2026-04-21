# import torch
# import clip
# from PIL import Image

# device = "cuda" if torch.cuda.is_available() else "cpu"
# model, preprocess = clip.load("ViT-B/32", device=device)
# model.eval()

# def get_image_embedding(image_path):
#     image = preprocess(
#         Image.open(image_path).convert("RGB")
#     ).unsqueeze(0).to(device)

#     with torch.no_grad():
#         embedding = model.encode_image(image)
#         embedding /= embedding.norm(dim=-1, keepdim=True)

#     return embedding.squeeze().cpu().tolist()


def get_image_embedding(image):
    return None