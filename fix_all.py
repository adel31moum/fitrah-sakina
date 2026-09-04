import re

with open('index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# ============================================================
# FIX P1: z-index — narration z-index:20, backgrounds z-index:1, scene::after z-index:2
# ============================================================

# 1a. narration z-index:15 → z-index:20
code = code.replace(
    '.narration{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:15;',
    '.narration{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20;'
)

# 1b. Add z-index:1 to all CSS background divs that are inside scenes
# css-city
code = code.replace(
    '.css-city{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#0a0a14',
    '.css-city{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#0a0a14'
)
# css-laws
code = code.replace(
    '.css-laws{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#0e0a14',
    '.css-laws{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#0e0a14'
)
# css-phone
code = code.replace(
    '.css-phone{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:radial-gradient',
    '.css-phone{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:radial-gradient'
)
# css-rain
code = code.replace(
    '.css-rain{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#0a0a0e',
    '.css-rain{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#0a0a0e'
)
# tent-interior
code = code.replace(
    '.tent-interior{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:radial-gradient(ellipse at 50% 30%',
    '.tent-interior{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:radial-gradient(ellipse at 50% 30%'
)
# css-dawn
code = code.replace(
    '.css-dawn{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#1a0e08',
    '.css-dawn{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#1a0e08'
)
# css-stars
code = code.replace(
    '.css-stars{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#050810',
    '.css-stars{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#050810'
)
# css-sunset
code = code.replace(
    '.css-sunset{position:absolute;top:0;left:0;width:100%;height:100%;\n  background:linear-gradient(180deg,#1a0a08',
    '.css-sunset{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;\n  background:linear-gradient(180deg,#1a0a08'
)

# 1c. scene::after — add z-index:2 (above backgrounds, below narration)
code = code.replace(
    ".scene::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg,rgba(5,4,2,0.2) 0%,rgba(5,4,2,0.05) 30%,rgba(5,4,2,0.35) 70%,rgba(5,4,2,0.92) 100%);pointer-events:none}",
    ".scene::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;background:linear-gradient(180deg,rgba(5,4,2,0.2) 0%,rgba(5,4,2,0.05) 30%,rgba(5,4,2,0.35) 70%,rgba(5,4,2,0.92) 100%);pointer-events:none}"
)

# 1d. scene-video also needs z-index:1
code = code.replace(
    '.scene-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}',
    '.scene-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1}'
)

# ============================================================
# FIX P2: Hide narration subtitle text — keep only icon + voice
# ============================================================

# Change the narration show rule to only show icon, not text
code = code.replace(
    '.narration.show .narr-icon,.narration.show .narr-title,.narration.show .narr-sub{opacity:1}',
    '.narration.show .narr-icon{opacity:1}\n.narr-title,.narr-sub{display:none!important}'
)

# ============================================================
# FIX P4: Add "next" button to topbar
# ============================================================
code = code.replace(
    '<button class="ctrl-btn skip" onclick="skipScene()">تخطي ⏭</button>',
    '<button class="ctrl-btn" onclick="prevScene()" style="font-size:1rem">‹</button>\n    <button class="ctrl-btn skip" onclick="nextScene()">التالي ❯</button>\n    <button class="ctrl-btn skip" onclick="skipAll()" style="font-size:.7rem">تخطي ⏭</button>'
)

# ============================================================
# FIX P5: Add WhatsApp share button
# ============================================================
# Add share button CSS
code = code.replace(
    '/* ===== START OVERLAY ===== */',
    '''/* Share button */
.share-btn{position:fixed;bottom:15px;left:50%;transform:translateX(-50%);z-index:999;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border:none;border-radius:20px;padding:8px 18px;font-size:.72rem;cursor:pointer;font-family:'Cairo';font-weight:700;box-shadow:0 3px 12px rgba(37,211,102,0.3);display:none}
.share-btn.show{display:flex;align-items:center;gap:5px}
.share-btn svg{width:16px;height:16px;fill:#fff}

/* ===== START OVERLAY ===== */'''
)

# Add share button HTML (before ai-btn)
code = code.replace(
    '<!-- AI SUPPORT -->\n<button class="ai-btn"',
    '<!-- SHARE -->\n<button class="share-btn" id="shareBtn" onclick="shareFilm()"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.99.97 4.29L2 22l5.71-.97C9.01 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg> شارك الفيلم الدعوي</button>\n\n<!-- AI SUPPORT -->\n<button class="ai-btn"'
)

# ============================================================
# FIX P3 & E3: Add timeout fallback to playAyah
# ============================================================
old_playAyah = '''function playAyah(surah,ayah,onDone){
  if(!soundOn){if(onDone)setTimeout(onDone,5000);return}
  initAudio();stopAyah();
  var url='https://everyayah.com/data/Alafasy_128kbps/'+String(surah).padStart(3,'0')+String(ayah).padStart(3,'0')+'.mp3';
  var a=new Audio();qAudio=a;
  a.crossOrigin='anonymous';
  a.onloadedmetadata=function(){
    var dur=a.duration;
    if(dur&&!isNaN(dur)){
      // Add extra time after recitation
      a.onended=function(){if(onDone)setTimeout(onDone,2000)};
      a.play().catch(function(){if(onDone)setTimeout(onDone,dur*1000+2000)});
    }else{
      a.onended=function(){if(onDone)setTimeout(onDone,2000)};
      a.play().catch(function(){if(onDone)setTimeout(onDone,8000)});
    }
  };
  a.onerror=function(){
    // Fallback: try different reciter
    var url2='https://everyayah.com/data/Husary_128kbps/'+String(surah).padStart(3,'0')+String(ayah).padStart(3,'0')+'.mp3';
    var a2=new Audio();qAudio=a2;
    a2.onended=function(){if(onDone)setTimeout(onDone,2000)};
    a2.onerror=function(){if(onDone)setTimeout(onDone,5000)};
    a2.src=url2;
    a2.play().catch(function(){if(onDone)setTimeout(onDone,5000)});
  };
  a.src=url;
}'''

new_playAyah = '''function playAyah(surah,ayah,onDone){
  if(!soundOn){if(onDone)setTimeout(onDone,5000);return}
  initAudio();stopAyah();
  var url='https://everyayah.com/data/Alafasy_128kbps/'+String(surah).padStart(3,'0')+String(ayah).padStart(3,'0')+'.mp3';
  var a=new Audio();qAudio=a;var done=false;
  function finish(){if(done)return;done=true;if(onDone)setTimeout(onDone,2000)}
  // P3 FIX: 12s timeout fallback — if metadata doesn't load, skip
  var timeout=setTimeout(function(){if(!done){console.warn('Ayah timeout:',url);finish()}},12000);
  a.onloadedmeta=function(){
    clearTimeout(timeout);
    a.onended=function(){finish()};
    a.play().catch(function(){finish()});
  };
  a.onloadeddata=a.onloadedmetadata;
  a.onerror=function(){
    clearTimeout(timeout);
    // Fallback: try Husary reciter
    var url2='https://everyayah.com/data/Husary_128kbps/'+String(surah).padStart(3,'0')+String(ayah).padStart(3,'0')+'.mp3';
    var a2=new Audio();qAudio=a2;var t2=setTimeout(function(){if(!done){finish()}},12000);
    a2.onended=function(){clearTimeout(t2);finish()};
    a2.onerror=function(){clearTimeout(t2);finish()};
    a2.src=url2;
    a2.play().catch(function(){clearTimeout(t2);finish()});
  };
  a.src=url;
}'''

code = code.replace(old_playAyah, new_playAyah)

# Also fix stopAyah to be more thorough (E6: memory leak)
old_stopAyah = "function stopAyah(){if(qAudio){qAudio.pause();qAudio.onerror=null;qAudio.onended=null;qAudio.src='';qAudio=null}}"
new_stopAyah = "function stopAyah(){if(qAudio){try{qAudio.pause()}catch(e){}try{qAudio.onloadedmetadata=null}catch(e){}try{qAudio.onloadeddata=null}catch(e){}try{qAudio.onerror=null}catch(e){}try{qAudio.onended=null}catch(e){}try{qAudio.src=''}catch(e){}qAudio=null}}"
code = code.replace(old_stopAyah, new_stopAyah)

# Also fix stopAmbient to disconnect nodes (E6)
old_stopAmbient = "function stopAmbient(){if(ambientN){try{ambientN.src.stop()}catch(e){}try{ambientN.lfo.stop()}catch(e){}ambientN=null}}"
new_stopAmbient = "function stopAmbient(){if(ambientN){try{ambientN.src.stop()}catch(e){}try{ambientN.src.disconnect()}catch(e){}try{ambientN.lfo.stop()}catch(e){}try{ambientN.lfo.disconnect()}catch(e){}ambientN=null}}"
code = code.replace(old_stopAmbient, new_stopAmbient)

# ============================================================
# FIX P4: Add nextScene, prevScene, skipAll functions
# ============================================================
old_skipScene = '''window.skipScene=function(){
  if(!active)return;
  stopAyah();window.speechSynthesis&&window.speechSynthesis.cancel();
  document.getElementById('voiceInd').classList.remove('show');
  if(sceneTimer)clearTimeout(sceneTimer);
  showScene(curScene+1);
  // Track current scene
};'''

new_skipScene = '''window.nextScene=function(){
  if(!active)return;
  stopAyah();window.speechSynthesis&&window.speechSynthesis.cancel();
  document.getElementById('voiceInd').classList.remove('show');
  if(sceneTimer)clearTimeout(sceneTimer);
  showScene(curScene+1);
};
window.prevScene=function(){
  if(!active||curScene<=0)return;
  stopAyah();window.speechSynthesis&&window.speechSynthesis.cancel();
  document.getElementById('voiceInd').classList.remove('show');
  if(sceneTimer)clearTimeout(sceneTimer);
  showScene(curScene-1);
};
window.skipAll=function(){
  if(!active)return;
  stopAyah();stopAmbient();window.speechSynthesis&&window.speechSynthesis.cancel();
  document.getElementById('voiceInd').classList.remove('show');
  if(sceneTimer)clearTimeout(sceneTimer);
  document.getElementById('cinema').style.position='relative';
  document.getElementById('cinema').style.height='100vh';
  document.getElementById('shareBtn').classList.add('show');
  window.scrollTo({top:window.innerHeight,behavior:'smooth'});
};
window.skipScene=window.nextScene;'''

code = code.replace(old_skipScene, new_skipScene)

# ============================================================
# FIX P5: Add shareFilm function
# ============================================================
# Add shareFilm after the toggleSound function
old_toggleSound_end = """  else{var sc=scenes[curScene];if(sc)startAmbient(sc.ambient)}
};"""

new_toggleSound_end = """  else{var sc=scenes[curScene];if(sc)startAmbient(sc.ambient)}
};

window.shareFilm=function(){
  var url='https://fitrah-sakina.vercel.app';
  var text='🌿 شاهد رحلة العودة إلى الزواج على السنة — فطرة وسكينة\\n'+url;
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
};"""

code = code.replace(old_toggleSound_end, new_toggleSound_end)

# ============================================================
# Show share button after scene 7 (last scene)
# ============================================================
old_end_scenes = """  document.getElementById('cinema').style.position='relative';
  document.getElementById('cinema').style.height='100vh';
  window.scrollTo({top:window.innerHeight,behavior:'smooth'});
  return;"""

new_end_scenes = """  document.getElementById('cinema').style.position='relative';
  document.getElementById('cinema').style.height='100vh';
  document.getElementById('shareBtn').classList.add('show');
  window.scrollTo({top:window.innerHeight,behavior:'smooth'});
  return;"""

code = code.replace(old_end_scenes, new_end_scenes)

# ============================================================
# FIX S1: Add hadith field to scenes and separate from Quran
# ============================================================
# Add hadith to scenes that need it (scenes 4 and 7 have marriage-related content)
old_scenes_start = """var scenes=[
  {act:1,ambient:'city',narration:'حين تخلّى البشر"""

new_scenes_start = """var scenes=[
  {act:1,ambient:'city',hadith:'قال النبي ﷺ: «لم يترك بعد فتنة أضر على الرجال من النساء» — رواه البخاري ومسلم',narration:'حين تخلّى البشر"""

code = code.replace(old_scenes_start, new_scenes_start)

# Add hadith to scene 4 (marriage)
old_scene4 = "{act:2,ambient:'wind',narration:'وفي رحاب الصحراء"
new_scene4 = "{act:2,ambient:'wind',hadith:'قال النبي ﷺ: «يا معشر الشباب من استطاع منكم الباءة فليتزوج» — رواه البخاري ومسلم عن ابن مسعود',narration:'وفي رحاب الصحراء"
code = code.replace(old_scene4, new_scene4)

# Add hadith to scene 5 (contract)
old_scene5 = "{act:2,ambient:'fire',narration:'في خيمة صحراء"
new_scene5 = "{act:2,ambient:'fire',hadith:'قال النبي ﷺ: «اتقوا الله في النساء، فإنهن عوان عندكم» — رواه مسلم',narration:'في خيمة صحراء"
code = code.replace(old_scene5, new_scene5)

# Add hadith to scene 7 (call to action)
old_scene7 = "{act:2,ambient:'fire',narration:'الآن دورك"
new_scene7 = "{act:2,ambient:'fire',hadith:'قال النبي ﷺ: «ثلاثة حق على الله عونهم: الناكح يريد العفاف» — رواه الترمذي والنسائي',narration:'الآن دورك"
code = code.replace(old_scene7, new_scene7)

# Add hadith display after Quran recitation in showScene
old_narration_flow = """  // Play narration (voice)
  speakArabic(sc.narration,function(){
    document.getElementById('voiceInd').classList.remove('show');
    // After narration, play Quran recitation
    setTimeout(function(){
      document.getElementById('voiceInd').classList.add('show');
      playAyah(sc.ayah.s,sc.ayah.a,function(){
        document.getElementById('voiceInd').classList.remove('show');
        // Move to next scene
        sceneTimer=setTimeout(function(){showScene(i+1)},2000);
      });
    },1000);
  });"""

new_narration_flow = """  // Play narration (voice) — S1: hadith spoken separately from Quran
  speakArabic(sc.narration,function(){
    document.getElementById('voiceInd').classList.remove('show');
    // After narration, play hadith if exists (as hadith, NOT as Quran)
    if(sc.hadith){
      setTimeout(function(){
        document.getElementById('voiceInd').classList.add('show');
        speakArabic(sc.hadith,function(){
          document.getElementById('voiceInd').classList.remove('show');
          // Then play Quran recitation (clearly separated from hadith)
          setTimeout(function(){
            document.getElementById('voiceInd').classList.add('show');
            playAyah(sc.ayah.s,sc.ayah.a,function(){
              document.getElementById('voiceInd').classList.remove('show');
              sceneTimer=setTimeout(function(){showScene(i+1)},2000);
            });
          },800);
        });
      },800);
    } else {
      // No hadith — go straight to Quran
      setTimeout(function(){
        document.getElementById('voiceInd').classList.add('show');
        playAyah(sc.ayah.s,sc.ayah.a,function(){
          document.getElementById('voiceInd').classList.remove('show');
          sceneTimer=setTimeout(function(){showScene(i+1)},2000);
        });
      },1000);
    }
  });"""

code = code.replace(old_narration_flow, new_narration_flow)

# Also fix the Sharia rule for S1 — change "ممذون" to "محفوف" (S7 correction from Sharia review)
code = code.replace('شاربٍ ممذون', 'شاربٍ محفوف')
# Also in English/other if present
code = code.replace('trimmed mustache', 'neatly trimmed mustache')

# Fix S5: AI response about wali
old_wali_ai = "{k:['ولي','ولاية'],r:'بدون وليٍّ، تتولّى المنصة جهة الولاية الشرعية المختصة.'}"
new_wali_ai = "{k:['ولي','ولاية'],r:'في حال عدم وجود وليّ، تُوجَّه للمحكمة الشرعية أو القاضي الشرعي المختص، إذ السلطان وليّ من لا ولي له.'}"
code = code.replace(old_wali_ai, new_wali_ai)

# ============================================================
# Write the fixed file
# ============================================================
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(code)

# Verify fixes
print("=== VERIFICATION ===")
print(f"File size: {len(code)} chars")
print(f"P1 - narration z-index:20: {'z-index:20' in code and '.narration' in code}")
print(f"P1 - backgrounds z-index:1: {code.count('z-index:1')}")
print(f"P1 - scene::after z-index:2: {'z-index:2' in code}")
print(f"P2 - narr-title display:none: {'.narr-title,.narr-sub{display:none' in code}")
print(f"P3 - timeout fallback: {'timeout=setTimeout' in code}")
print(f"P4 - nextScene: {'nextScene' in code}")
print(f"P4 - prevScene: {'prevScene' in code}")
print(f"P4 - skipAll: {'skipAll' in code}")
print(f"P5 - shareFilm: {'shareFilm' in code}")
print(f"P5 - share button HTML: {'shareBtn' in code}")
print(f"S1 - hadith field: {'hadith:' in code}")
print(f"S1 - hadith separated from Quran: {'sc.hadith' in code}")
print(f"S7 - محفوف: {'محفوف' in code}")
print(f"S5 - wali fix: {'السلطان وليّ' in code}")
print(f"E6 - disconnect: {'disconnect()' in code}")
