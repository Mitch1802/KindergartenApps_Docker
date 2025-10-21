import json

from rest_framework.renderers import JSONRenderer


class ModulJSONRenderer(JSONRenderer):
    charset = "utf-8"
    modul_name = "Unbenannt"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = renderer_context["response"].status_code if renderer_context else 200

        # Fehlerbehandlung nur für dicts
        if isinstance(data, dict) and data.get("errors", None):
            return super().render(data, accepted_media_type, renderer_context)

        return json.dumps({
            "status_code": status_code,
            "modul": self.modul_name,
            "data": data
        })


class UserJSONRenderer(ModulJSONRenderer):
    modul_name = "User"
