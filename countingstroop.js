/* create timeline */
var timeline = [];

/* preload images */
var repo_site =  "https://dvitaa.github.io/countingstroop/";

/* define welcome message trial */
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Press any key to begin."
};
timeline.push(welcome);

/* define instructions trial */
var instructions = {
  type: "html-keyboard-response",
  stimulus: 
  "<p> In this experiment, a series of words will appear on the screen.</p>" +
  "<p>Count the number of words on the screen. Press the number key that corresponds with the number of words on the screen. </p>" +
  "<p> For example, the image below shows the word fan four times. So, you would press the number key 4 on your keyboard as fast as you can. </p>" +
  "<div style='width: 700px;'>" +
  "<div style=><img src='img/1.png'></img>" +
  "<p><strong>Press the 4 number key</strong></div>" +
  "</div>" +
  "<p>Press any key to begin.</p>",
  post_trial_gap: 2000
}; 

timeline.push(instructions);

/* test trials */
var test_stimuli = [
  { stimulus: repo_site + "img/1.png", 
    data: {
      test_part: 'test',
      correct_response: '4'
      }
  },
  { stimulus: repo_site + "img/2.png", 
    data: {
      test_part: 'test',
      correct_response: '4' 
    }
  }
];

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: function () {
    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
  },
  data: {
    task: 'fixation'
  }
}

var test = {
  type: "image-keyboard-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['1','2','3','4'],
  data: {
    task: 'response',
    correct_response: jsPsych.timelineVariable('correct_response')
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
  }
}

var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(test_procedure);

/* define debrief */

var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function () {

    var trials = jsPsych.data.get().filter({ task: 'response' });
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
    <p>Your average response time was ${rt}ms.</p>
    <p>Press any key to complete the experiment. Thank you!</p>`;

  }
};
timeline.push(debrief_block);


/* start the experiment */

jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    jsPsych.data.displayData();
  }
});

