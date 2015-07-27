<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-weibo"></i> Weibo Social Authentication</div>
			<div class="panel-body">
				<p>
					Register a new <strong>Weibo Application</strong> via
					<a href="http://open.weibo.com/">Open Weibo</a> and then paste
					your application details here. Your callback URL is yourdomain.com/auth/weibo/callback
				</p>
				<br />
				<form class="sso-weibo">
					<div class="form-group">
						<label for="id">Client ID</label>
						<input type="text" name="id" title="App Key" class="form-control" placeholder="App key"><br />
					</div>
					<div class="form-group">
						<label for="secret">Client Secret</label>
						<input type="text" name="secret" title="App Secret" class="form-control" placeholder="App Secret">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Weibo Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
	require(['settings'], function(Settings) {
		Settings.load('sso-weibo', $('.sso-weibo'));

		$('#save').on('click', function() {
			Settings.save('sso-weibo', $('.sso-weibo'), function() {
				app.alert({
					type: 'success',
					alert_id: 'weibo-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	});
</script>