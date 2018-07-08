$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on("click", trivia.startGame);
    $(document).on("click" , ".option", trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : " ",
    // questions options and answers data
    questions: {
      q1: "Who hates Thanksgiving?",
      q2: "What does Joey love to eat?",
      q3: "How many times has Ross been divorced?",
      q4: "How many types of towels does Monica have?",
      q5: "Who stole Monica's thunder after she got engaged?",
      q6: "Who is actually a chef?",
      q7: "Who thinks they're always the last to find out everything?"
    },
    options: {
      q1: ["Joey","Chandler","Rachel","Ross"],  
      q2: ["Fish", "Apples", "Oranges", "Sandwhiches"],
      q3: ["5", "2", "1", "3"],
      q4: ["3", "8", "11", "6"],
      q5: ["Rachel","Phoebe","Emily","Carol"],
      q6: ["Monica", "Chandler", "Rachel", "Ross"],
      q7: ["Ross", "Phoebe", "Monica","Chandler"]
    },
    answers: {
      q1: "Chandler",
      q2: "Sandwhiches",
      q3: "3",
      q4: "11",
      q5: "Rachel",
      q6: "Monica",
      q7: "Phoebe"
    },
    // trivia methods
    // method to initialize game
    startGame: function(){
      // restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $("#game").show();
      
      //  empty last results
      $("#results").html(" ");
      
      // show timer
      $("#timer").text(trivia.timer);
      
      // remove start button
      $("#start").hide();
  
      $("#remaining-time").show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // method to loop through and display questions/options 
    nextQuestion : function(){
      
      // set timer to 20 seconds each question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      //prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets the questions then indexes current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all user options for current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all trivia guess options in html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Times Up! The answer is '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thanks for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },
    // evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      //answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // user picked the wrong option, increment incorrect
      else{
        // button clicked red when incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },
    // remove previous question results and options
     guessResult : function(){
      
      // increment to next Q set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // start next question
      trivia.nextQuestion();
       
    }
  
  }