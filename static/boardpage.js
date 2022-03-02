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
