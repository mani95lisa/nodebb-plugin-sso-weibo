<h1><i class="fa fa-weibo"></i>Weibo Social Authentication</h1>
<hr />

<form>
  <div class="alert alert-warning">
    <p>
      Create a <strong>Weibo Application</strong> via the
      <a href="http://open.weibo.com">Weibo Open Platform</a> and then paste
      your application details here.
    </p>
    <br />
    <input type="text" data-field="social:weibo:app_id" title="Application ID" class="form-control input-lg" placeholder="App ID"><br />
    <input type="text" data-field="social:weibo:secret" title="Application Secret" class="form-control input-md" placeholder="App Secret"><br />
  </div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
  require(['admin/settings'], function(Settings) {
      Settings.prepare();
  });
</script>
