{% extends "./layout.swig" %}

{% block content %}
  <div class="row">
    <main class="small-12 large-9 column">
      {% include "partials/post.html" %}
    </main>
    <!-- TODO: Disqus -->
    <!-- TODO: Related posts? Previous/Next? -->

    {% include "partials/about-me.swig" %}
  </div>
{% endblock %}
