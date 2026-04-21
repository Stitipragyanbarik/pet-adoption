from rest_framework import serializers
from .models import ( 
    Pet,
    PetImage,
    AdoptionRequest,
    LostFoundReport,
    LostFoundImage,
    Favorite,
    LostFoundResponse,
)

class PetImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetImage
        fields = ["id", "image"]


class PetCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Pet
        fields = [
            "name",
            "type",
            "breed",
            "age",
            "location",
            "lat",
            "lng",
            "vaccination_status",
            "description",
            "images",
        ]

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        user = self.context["request"].user

        pet = Pet.objects.create(owner=user, **validated_data)

        for image in images:
            PetImage.objects.create(pet=pet, image=image)

        return pet

class PetImageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetImage
        fields = ['id','image']

class PetListSerializer(serializers.ModelSerializer):
    images = PetImageSerializer(many=True, read_only=True)
    owner = serializers.StringRelatedField()

    class Meta:
        model = Pet
        fields = [
            "id",
            "name",
            "type",
            "breed",
            "age",
            "location",
            "vaccination_status",
            "description",
            "images",
            "owner",
            "created_at",
            "is_active",
        ]

class AdoptionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionRequest
        fields = ["message"]

class LostFoundImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostFoundImage
        fields = ["image"]


class LostFoundReportSerializer(serializers.ModelSerializer):
    images = LostFoundImageSerializer(many=True, required=False)

    class Meta:
        model = LostFoundReport
        fields = [
            "id",
            "report_type",
            "pet_name",
            "pet_type",
            "breed",
            "location_found",
            "description",
            "status",
            "images",
        ]

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        report = LostFoundReport.objects.create(**validated_data)

        for img in images_data:
            LostFoundImage.objects.create(report=report, **img)

        return report


class FavoriteSerializer(serializers.ModelSerializer):
    pet_id = serializers.IntegerField(source="pet.id")

    class Meta:
        model = Favorite
        fields = ["id", "pet_id", "created_at"]

class AdoptionRequestDetailSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source="requester.username")
    requester_email = serializers.EmailField(source="requester.email")
    phone = serializers.CharField()
    pet_name = serializers.CharField(source="pet.name")

    class Meta:
        model = AdoptionRequest
        fields = [
            "id",
            "pet_name",
            "requester_name",
            "requester_email",
            "phone",
            "message",
            "status",
            "created_at",
        ]

class LostFoundResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostFoundResponse
        fields = ["id", "phone", "message"]
        report_title = serializers.CharField(
            source="report.pet_name", read_only=True
        )

class LostFoundResponseDetailSerializer(serializers.ModelSerializer):
    responder_name = serializers.CharField(
        source="responder.username",
        read_only=True
    )
    responder_email = serializers.EmailField(
        source="responder.email",
        read_only=True
    )
    responder_phone = serializers.CharField(
        source="responder.phone",
        read_only=True
    )

    class Meta:
        model = LostFoundResponse
        fields = [
            "id",
            "responder_name",
            "responder_email",
            "responder_phone",
            "message",
            "status",
            "created_at",
        ]
