# Third party modules
from rest_framework import status
from rest_framework.response import Response

# Module imports
from utrack.app.permissions import WorkspaceEntityPermission
from utrack.app.serializers import WorkspaceEstimateSerializer
from utrack.app.views.base import BaseAPIView
from utrack.db.models import Estimate, Project
from utrack.utils.cache import cache_response


class WorkspaceEstimatesEndpoint(BaseAPIView):
    permission_classes = [
        WorkspaceEntityPermission,
    ]

    @cache_response(60 * 60 * 2)
    def get(self, request, slug):
        estimate_ids = Project.objects.filter(
            workspace__slug=slug, estimate__isnull=False
        ).values_list("estimate_id", flat=True)
        estimates = (
            Estimate.objects.filter(pk__in=estimate_ids, workspace__slug=slug)
            .prefetch_related("points")
            .select_related("workspace", "project")
        )

        serializer = WorkspaceEstimateSerializer(estimates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
