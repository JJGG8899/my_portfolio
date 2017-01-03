$(document).ready(function() {
		$('.menu-icon').click(function(e) {
			e.stopPropagation();
			$('.side-nav').toggleClass('active');
		});

		$(document).click(function() {
			$('.side-nav').removeClass('active');
		});

		$('.delete-work').on('click',function(){
			var id = $(this).data('id');
			var url = '/work/delete/' + id;
			if(confirm('You sure to delete it?')){
				$.ajax({
					url: url,
					type:'DELETE',
					success: function(result){
						console.log('Deleting work...');
						window.location.href ='/manage-works';
					},
					error: function(error){
						console.log(error);
					}
				});
			}
		});
});
