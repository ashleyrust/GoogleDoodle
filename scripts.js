(function() {
  'use strict';
  const START_DELAY = 0.05,
        FLASH_DELAY = 1,
        STAGGER_DUR = 0.075,
        REVEAL_DUR = .9,
        FLASH_DUR = 0.1;

  const easeOut2 = Power2.easeOut,
        easeOut4 = Power4.easeOut,
        elasticOut1 = Elastic.easeOut.config(1.2, 0.5),
        elasticOut2 = Elastic.easeOut.config(1, 0.75);

  let tl,
      tl_loop,
      tl_click;

  let _a = {
    randFloat: (a, b) => Math.random() * (b - a) + a,
    randDirection: () => Math.random() > .5 ? -1 : 1,
    init: () => {
      _a.initEls();
      _a.initVars();
      _a.reveal();
      _a.loop(true);
    },
    initEls: () => {},
    initVars: () => {
      tl = new TimelineMax({delay: START_DELAY});
      tl_loop = new TimelineMax({paused: true});
      tl_click = new TimelineMax();
    },
    reveal: () => {
      tl.from('#curtain_holder', REVEAL_DUR, {opacity: 0, autoAlpha: 0, ease: easeOut2}, 'reveal+=0')
        .from('#curtain_top', REVEAL_DUR, {opacity: 0, autoAlpha: 0, ease: easeOut4}, 'reveal+=0').addLabel('curtain')
        .from('#curtain_bottom', REVEAL_DUR, {attr: {y: -631}, ease: easeOut4}, `reveal+=${REVEAL_DUR/5}`)
        .from('#text', REVEAL_DUR, {attr: {y: -631}, ease: easeOut4}, `reveal+=${REVEAL_DUR/10}`)
        .from('#light_left', REVEAL_DUR, {y: '-=100', opacity: 0, autoAlpha: 0, ease: elasticOut1}, `reveal+=${STAGGER_DUR}`)
        .from('#light_right', REVEAL_DUR, {y: '-=100', opacity: 0, autoAlpha: 0, ease: elasticOut1}, `reveal+=${STAGGER_DUR*2}`)
        .from('#prop_left', REVEAL_DUR, {scale: 0, transformOrigin: '50% 100%', ease: elasticOut2}, `reveal+=${STAGGER_DUR*3}`)        
        .from('#prop_right', REVEAL_DUR, {scale: 0, transformOrigin: '50% 100%', ease: elasticOut2}, `reveal+=${STAGGER_DUR*4}`).addLabel('camera')
        .from('#camera', REVEAL_DUR, {scale: 0, transformOrigin: '50% 100%', ease: elasticOut2}, `reveal+=${(STAGGER_DUR*5)+0.1}`)
        .fromTo('#flash', tl.duration(), {opacity: 1}, {opacity: 1}, 'reveal+=0');

      tl_loop.delay(tl.duration());
    },
    loop: (f) => {
      let dur = FLASH_DUR,
          delay = FLASH_DELAY;
      
      f ? (
        (tl_loop.fromTo('#flash', delay, {opacity: 1}, {opacity: 1}, 'flashDelay')),
        (_a.showClick(tl.duration() + 0))
      ) : tl_loop.addLabel('flashDelay');

      tl_loop.fromTo('#flash', dur, {opacity: .3}, {opacity: 1}, `flashDelay+=${delay}`).addLabel('flash');
      (
        _a.randDirection < 0 ?
          tl_loop.fromTo('#flash', dur, {opacity: .3}, {opacity: 1}, `+=${dur}`).fromTo('#flash', dur, {opacity: .3}, {opacity: 1}, `+=${dur}`) :
          tl_loop.fromTo('#flash', dur, {opacity: .3}, {opacity: 1}, `+=${dur}`)
      ).call(_a.flashDelay).play();

    },
    flashDelay: () => {
      let newDelay = _a.randFloat(FLASH_DUR*2, 3.333);
      TweenLite.delayedCall(newDelay, function() {
        tl_loop.restart();
      });
      console.log(`Next flash repeat delay: ${newDelay}`);
    },
    showClick: (d) => {
      tl_click.fromTo('#click', d, {opacity: 0, autoAlpha: 0}, {opacity: 0, autoAlpha: 0}, 'clickDelay')
              .to('#click', 0.1, {opacity: 1, autoAlpha: 1}, `clickDelay+=${d}`);
    }
  }
  _a.init();
})();