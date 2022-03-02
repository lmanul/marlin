const setNewQuestionFormVisibility = (flag) => {
  document.getElementById('board-add-question').style.display =
      flag ? 'block' : 'none';
  document.getElementById('board-add-question-button').style.display =
      flag ? 'none' : 'inline-block';
  if (flag) {
    const area = document.getElementById('board-add-question-text');
    area.focus();
    area.addEventListener(
      'input', onNewQuestionTextModified);
  }
};

const showNewQuestionForm = () => {
  return setNewQuestionFormVisibility(true);
};

const hideNewQuestionForm = () => {
  return setNewQuestionFormVisibility(false);
};

const onNewQuestionTextModified = (e) => {
  document.getElementById('board-add-question-remaining-chars').textContent = '' +
      e.target.value.length + '/280';
};

const refresh = () => {
  fetch('/b-data/' + board.id).then((response) => {
    response.json().then((data) => {
      console.log('Response: ', data);
    });
  });
  window.setTimeout(refresh, 5000);
};
