const QUESTION_HEIGHT_EX = 25;
const QUESTION_MARGIN_EX = 2;

let questionIds = [];
let questionVotes = {};
let ownVotes = {};
const questionTexts = {};
const questionContexts = {};
const questionAuthors = {};
const questionElements = {};

let refreshTimeoutId = 0;

const setNewQuestionFormVisibility = (flag) => {
  document.getElementById('board-add-question').style.display =
      flag ? 'block' : 'none';
  document.getElementById('board-add-question-button').style.display =
      flag ? 'none' : 'inline-block';
  if (flag) {
    const area = document.getElementById('board-add-question-text');
    area.focus();
    area.addEventListener('input', onNewQuestionTextModified);
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

const fetchQuestionData = (questionId) => {
  fetch('/q-data/' + questionId).then((response) => {
    response.json().then((data) => {
      const obj = JSON.parse(data);
      questionTexts[questionId] = obj.text;
      questionContexts[questionId] = obj.context;
      questionAuthors[questionId] = obj.authorName;
      questionElements[questionId].querySelector('.question-text').textContent =
          questionTexts[questionId];
      questionElements[questionId].querySelector('.question-context').textContent =
          questionContexts[questionId];
      questionElements[questionId].querySelector('.question-author').textContent =
          '— ' + (questionAuthors[questionId] || 'Anonymous');
      questionElements[questionId].querySelector('.spinner').style.display = 'none';
    });
  });
};

const topPositionForIndex = (index) => {
  return (index * (QUESTION_HEIGHT_EX + QUESTION_MARGIN_EX)) + 'ex';
};

const getQuestionScore = (questionId) => {
  const votes = questionVotes[questionId];
  if (!votes) {
    return 0;
  }
  const score = Math.floor(votes.up - 0.5 * votes.meh - 1.5 * votes.down);
  return score;
};

const positionQuestions = () => {
  let i = 0;
  let sortedQuestionIds = Array.from(questionIds);
  sortedQuestionIds.sort((a, b) => {
    return getQuestionScore(b) - getQuestionScore(a);
  });
  sortedQuestionIds.forEach((id) => {
    const el = questionElements[id];
    el.style.top = topPositionForIndex(i++);
  });
  document.querySelector('main').style.height =
      (questionIds.length + 1) * (QUESTION_HEIGHT_EX + QUESTION_MARGIN_EX) + 'ex';
};

const vote = (questionId, vote) => {
  fetch('/action-vote/' + questionId + '/' + vote).then(() => {
    window.setTimeout(refresh, 200);
  });
};

const ensureQuestionData = () => {
  questionIds.forEach((id) => {
    if (questionTexts[id] === undefined || questionContexts[id] === undefined) {
      fetchQuestionData(id);
    }
  });
};

const ensureQuestionElements = () => {
  const template = document.getElementById('question-template');
  questionIds.forEach((id) => {
    if (!questionElements[id]) {
      const el = template.cloneNode(true /* deep */);
      el.setAttribute('id', 'question-' + id);
      const voteEls = el.querySelectorAll('.question-voting-updown');
      voteEls.forEach((el) => { el.setAttribute('data-id', id); });
      el.addEventListener('click', (e) => {
        e.target.classList.add('active');
        vote(e.target.getAttribute('data-id'), e.target.getAttribute('data'));
      });
      document.getElementById('questions').appendChild(el);
      questionElements[id] = el;
    }
  });
};

const updateCurrentVotes = () => {
  for (const questionId in ownVotes) {
    const questionEl = questionElements[questionId];
    const all = questionEl.querySelectorAll('.question-voting-updown');
    all.forEach((el) => { el.classList.remove('active'); });
    const activeEl = questionEl.querySelector('[data="' + ownVotes[questionId] + '"]');
    if (!!activeEl) {
      activeEl.classList.add('active');
    }
  }
};

const refresh = () => {
  if (!!refreshTimeoutId) {
    window.clearTimeout(refreshTimeoutId);
  }
  fetch('/b-data/' + board.id).then((response) => {
    response.json().then((data) => {
      const obj = JSON.parse(data);
      questionIds = obj.questionIds;
      questionVotes = obj.questionVotes;
      const totalVoteCount = obj.totalVoteCount;
      document.getElementById('total-vote-count').textContent = totalVoteCount;
      ownVotes = obj.ownVotes;
      const container = document.getElementById('questions');
      const globalSpinner = container.querySelector('.spinner');
      if (!!globalSpinner) {
        globalSpinner.style.display = 'none';
      }
      if (!questionIds || !questionIds.length) {
        container.innerHTML =
            '<big style="display: block; text-align: center; padding: 5ex 0;">∅</big>';
      }
      ensureQuestionData();
      ensureQuestionElements();
      positionQuestions();
      updateCurrentVotes();
    });
  });
  // TODO: exponential backoff if the user is idle.
  refreshTimeoutId = window.setTimeout(refresh, 5000);
};
