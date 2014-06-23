<h1>Weibo Social Authentication</h1>
<hr />

<form>
	<div class="alert alert-warning">
		<p>
			Register a new <strong>Weibo Application</strong> via
			<a href="http://open.weibo.com/">Weibo.com</a> and then paste
			your application details here. Your callback URL is yourdomain.com/auth/weibo/callback
		</p>
		<br />
		<input type="text" data-field="social:weibo:id" title="App Key" class="form-control input-lg" placeholder="App Key"><br />
		<input type="text" data-field="social:weibo:secret" title="App Secret" class="form-control" placeholder="App Secret"><br />
	</div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
	require(['forum/admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>