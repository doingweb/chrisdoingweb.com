{% extends "./layout.swig" %}

{% block content %}
  <div class="row">
    <main itemtype="http://schema.org/Blog" class="small-12 large-9 columns">
      {% for post in posts %}
        {% include "partials/post.html" with post only %}
      {% endfor %}
    </main>

    {% include "partials/about-me.swig" %}
  </div>
{% endblock %}
