# from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

#from letter_tracker.forms import EnterTrackingNumberForm
from letter_tracker.utils import get_scanners_from_db, get_updates_from_db


# Create your views here.

@csrf_exempt
def index(request):
    #form = EnterTrackingNumberForm()
    scanners = get_scanners_from_db()
    context = {
        #"form": form,
        "scanners": scanners,
    }
    return render(request, "letter_tracker/index.html", context)

@csrf_exempt
def get_tracking_data(request, tracking_number):
    updates = get_updates_from_db(tracking_number)
    return JsonResponse({'updates': updates})
