$('#create-form').on('submit', (event) => {
  event.preventDefault();
  const creatInput = $('#create-input');

  const token = $('input[name="_csrf"]').attr('value');
  const postId = $('input[name="postId"]').attr('value');
  $.ajaxSetup({
    beforeSend(xhr) {
      xhr.setRequestHeader('Csrf-Token', token);
    }
  });
  $.ajax({
    url: '/add-comment',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ comment: creatInput.val(), postId }),
    success(res) {
      console.log(res);
      $('.comment').append(`
        <p>${res.comment}</p>
        <small class="text-muted">Posted by <strong>${res.userId.userName}</strong>  on <strong>${
        res.date
      }</strong> </small>
        <hr>
      `);
      creatInput.val('');
    }
  });
});
