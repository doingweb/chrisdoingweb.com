<!doctype html>
<html class="no-js">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>{% if title %}{{ title }} - {% endif %}{{ site.description }}</title>
		{% if description -%}
			<meta name="description" content="{{ description }}">
			<meta property="og:description" content="{{ description }}">
		{%- endif %}
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="author" href="/humans.txt" />
		<link href="http://fonts.googleapis.com/css?family=Source+Code+Pro:400,700|Roboto:300,300italic,500,500italic|Vollkorn:400,400italic" rel="stylesheet" type="text/css">
		<link href="{{ url_for(theme.css.site) }}" rel="stylesheet" type="text/css">
		{% block css %}{% endblock %}
	</head>
	<body>
		{% include "partials/browse-happy.html" %}

		{% include "partials/navigation.html" %}
		<div class="content">
			{% block content %}{% endblock %}
		</div>
		{% include "partials/site-footer.html" %}

		{% include "partials/scripts.html" %}
		{% include "partials/google-analytics.html" %}
	</body>
</html>
