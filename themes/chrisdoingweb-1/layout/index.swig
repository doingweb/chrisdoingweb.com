{% extends "./layout.swig" %}

{% block css %}
  <link href="{{ url_for(theme.css.home) }}" rel="stylesheet" type="text/css">
{% endblock %}

{% block content %}
  <main>
    {{ contents | safe }}
  </main>
{% endblock %}
