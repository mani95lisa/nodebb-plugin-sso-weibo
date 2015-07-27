<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-github"></i> GitHub Social Authentication</div>
			<div class="panel-body">
				<p>
					Register a new <strong>GitHub Application</strong> via 
					<a href="https://github.com/settings/applications">Developer Applications</a> and then paste
					your application details here. Your callback URL is yourdomain.com/auth/github/callback
				</p>
				<br />
				<form class="sso-github">
					<div class="form-group">
						<label for="id">Client ID</label>
						<input type="text" name="id" title="Client ID" class="form-control" placeholder="Client ID"><br />
					</div>
					<div class="form-group">
						<label for="secret">Client Secret</label>
						<input type="text" name="secret" title="Client Secret" class="form-control" placeholder="Client Secret">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">GitHub Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
	require(['settings'], function(Settings) {
		Settings.load('sso-github', $('.sso-github'));

		$('#save').on('click', function() {
			Settings.save('sso-github', $('.sso-github'), function() {
				app.alert({
					type: 'success',
					alert_id: 'github-saved',
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