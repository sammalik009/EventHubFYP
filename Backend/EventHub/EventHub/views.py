from allauth.account.adapter import DefaultAccountAdapter
# from django.conf import settings
from django.http import HttpResponse
from django.contrib.sites.models import Site


class CustomAllauthAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        account_confirm_email = '/User/'+str(context['user'].pk)+'/activate/'
        context['activate_url'] = (
            str('http://127.0.0.1:3000') + account_confirm_email
        )
        print(template_prefix)
        s = Site()
        s.domain = 'EventHub'
        s.name = 'EventHub'
        context['current_site'] = (
            s
        )
        msg = self.render_mail(template_prefix, email, context)
        print(msg.send())


def hello(request):
    return HttpResponse('<h1>hello</h1>')
