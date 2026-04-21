# from django.core.mail import send_mail
# from django.conf import settings


# def send_adoption_email(owner, pet, requester, message):
#     """
#     Sends an email to the pet owner when an adoption request is received.
#     """

#     subject = f"New adoption request for {pet.name}"

#     body = f"""
# Hello {owner.username},

# You have received a new adoption request for your pet "{pet.name}".

# Requester details:
# Name: {requester.get_full_name() or requester.username}
# Email: {requester.email}
# Phone: {requester.phone}

# Message from requester:
# {message}

# Please log in to PetRescue to respond.

# — PetRescue Team
# """

#     send_mail(
#         subject=subject,
#         message=body,
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[owner.email],
#         fail_silently=False,
#     )
