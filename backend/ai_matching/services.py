from pathlib import Path
import sys
from importlib import import_module

from django.conf import settings


_image_similarity_func = None


def _get_image_similarity_func():
    """
    Dynamically import the image_similarity function from the standalone
    AI-IMAGE-MATCHING module without requiring it to be a proper Python package
    name (it contains a hyphen).
    """
    global _image_similarity_func
    
    if _image_similarity_func is not None:
        return _image_similarity_func

    base_dir = Path(__file__).resolve().parent.parent  # backend/
    ml_dir = base_dir.parent / "AI-IMAGE-MATCHING" / "ml"

    if str(ml_dir) not in sys.path:
        sys.path.append(str(ml_dir))

    module = import_module("image_similarity")
    _image_similarity_func = getattr(module, "image_similarity")
    return _image_similarity_func


def match_pet_images(lost_image_path: str, found_image_path: str) -> tuple[float, bool]:
    """
    Core service for computing similarity between two pet images.

    Both arguments should be absolute filesystem paths.
    Returns (score, is_match) where 0.0 <= score <= 1.0.
    """

    if not lost_image_path or not found_image_path:
        return 0.0, False

    lost_path = Path(lost_image_path)
    found_path = Path(found_image_path)

    if not lost_path.is_file() or not found_path.is_file():
        return 0.0, False

    image_similarity = _get_image_similarity_func()
    score = float(image_similarity(str(lost_path), str(found_path)) or 0.0)
    threshold = float(getattr(settings, "AI_MATCH_THRESHOLD", 0.75))

    return score, score >= threshold

from django.conf import settings
from django.utils import timezone
from ai_matching.models import PetMatch

def auto_confirm_match_if_needed(pet_match):
    """
    Automatically confirm AI matches above a confidence threshold.
    """
    threshold = getattr(settings, "AI_AUTO_CONFIRM_THRESHOLD", None)

    if threshold is None:
        return

    if pet_match.score >= threshold and not pet_match.admin_verified:
        lost = pet_match.lost_report
        found = pet_match.found_report

        pet_match.admin_verified = True
        pet_match.save(update_fields=["admin_verified"])

        # Update linked reports
        lost.match_status = "matched"
        found.match_status = "matched"
        lost.matched_report = found
        found.matched_report = lost
        lost.match_score = pet_match.score
        found.match_score = pet_match.score

        lost.save(update_fields=["match_status", "matched_report", "match_score"])
        found.save(update_fields=["match_status", "matched_report", "match_score"])
