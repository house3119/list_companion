from django import forms
from django.forms import PasswordInput


class login_form(forms.Form):
    username = forms.CharField(
        label="Username",
        min_length=1,
        max_length=30
    )

    password = forms.CharField(
        widget=PasswordInput(),
        label="Password",
        min_length=1,
        max_length=30
    )

    def __init__(self, *args, **kwargs):
        super(login_form, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"


class register_form(forms.Form):
    username = forms.CharField(
        label="Username",
        min_length=1,
        max_length=30
    )

    email = forms.EmailField(
        label="Email Address",
        min_length=1,
        max_length=30
    )

    password1 = forms.CharField(
        widget=PasswordInput(),
        label="Password",
        min_length=1,
        max_length=30
    )

    password2 = forms.CharField(
        widget=PasswordInput(),
        label="Confirm Password",
        min_length=1,
        max_length=30
    )

    def __init__(self, *args, **kwargs):
        super(register_form, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"


class new_list(forms.Form):
    list_name = forms.CharField(
        label="Name",
        min_length=1,
        max_length=30
    )

    def __init__(self, *args, **kwargs):
        super(new_list, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"