{% extends "./layout.swig" %}

{% block content %}
  <main class="row">
    <div class="small-12 columns">
      {{ contents | safe }}
    </div>
  </main>
{% endblock %}
