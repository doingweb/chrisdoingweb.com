<!-- TODO: vCard? schema.org? -->
<aside class="about-me small-12 large-3 columns">
  <div class="photo">{% cloudinary http://res.cloudinary.com/chrisdoingweb/image/upload/7d9827fbfafcd56ecb3b11c0d9d1f221_yyh0me.jpg false "My face." "portrait" %}</div>
  <p>I'm Chris! Making web stuff has been my thing since the end of the <a href="http://en.wikipedia.org/wiki/Browser_wars#The_first_browser_war">First Browser War</a>. I enjoy <b>design</b> and <b>UX</b>, but I'm really a <b>software engineer</b> at heart.</p>
  <ul class="contact">
    {% for link in contact.links -%}
    <li>
      <a href="{{link.url}}">{{ icon(link.icon) }}<span>{{link.title}}</span></a>
    </li>
    {%- endfor %}
  </ul>
</aside>
