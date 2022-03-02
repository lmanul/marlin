const showNewQuestionForm = () => {
  document.getElementById('board-add-question').style.display = 'block';
  document.getElementById('board-add-question-button').style.display = 'none';
  const area = document.getElementById('board-add-question-text');
  area.focus();
  area.addEventListener(
    'input', onNewQuestionTextModified);
};

const onNewQuestionTextModified = (e) => {
  document.getElementById('board-add-question-remaining-chars').textContent = '' +
      e.target.value.length + '/280';
};
