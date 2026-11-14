(() => {
"use strict";
const D = window.FOCUS_DATA || {};
const CORPUS = window.FOCUS_CORPUS || [];
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const plain = v => String(v ?? "").replace(/<[^>]*>/g,"").replace(/\*\*/g,"").replace(/[`*_#]/g,"").trim();
const nowISO = () => new Date().toISOString();
const STORAGE_KEY = "focus_tafra_os_v1";
const defaultState = () => ({
  version:1, journey:{completed:[],notes:{},startDate:"",selectedDay:1},
  tasks:[], weeklyReviews:[], researchNotes:[], toolData:{}, actualMetrics:{},
  settings:{}
});
let state = loadState();
let activePage="overview", learnTab="arabicBooks", tafraTab="bank", betafraTab="student", learnIdeasPage=1;
let selectedBook=null, selectedJourneyDay=1, selectedArchive="integrated";
let currentTool=null, timerHandle=null, timerSeconds=0, timerInitial=0, timerPaused=false;
let taskFilter="open", bankPage=1, bankPageSize=24, bankSearch="", bankSet="all", bankFormat="all", bankNiche="all";
let activeSheet="06C_60_Hero_Ideas_V3", sheetPage=1, sheetSearch="";
let archiveCache={};
let globalSearchTimer=null;

function loadState(){
  try { const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return defaultState(); return {...defaultState(),...JSON.parse(raw)}; }
  catch(e){ return defaultState(); }
}
function persist(){
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); updateOverview(); return true; }
  catch(e){ toast("تعذر الحفظ المحلي. صدّر بياناتك أو قلل الملاحظات."); return false; }
}
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove("show"),2600);
}
function openPage(name){
  activePage=name;
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
  $$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  const nav=$(`.nav-item[data-page="${name}"]`);
  const curSec = $("#currentSection");
  if(curSec) curSec.textContent=nav ? nav.querySelector("span:nth-child(2)")?.textContent || name : name;
  const sidebar = $("#sidebar");
  if(sidebar) sidebar.classList.remove("open");
  const mainScroll = $("#mainScroll");
  if(mainScroll) mainScroll.scrollTo({top:0,behavior:"smooth"});
  if(name==="overview") updateOverview();
  if(name==="student" && window.renderStudentHub) window.renderStudentHub();
  if(name==="learn") renderLearn();
  if(name==="tools") renderTools();
  if(name==="journey") renderJourney();
  if(name==="mastery") renderMastery();
  if(name==="tafra") renderTafra();
  if(name==="betafra") renderBetafra();
  if(name==="research") renderResearch();
  if(name==="archive") renderArchive();
}
function dataCount(k, fallback=0){return D.meta?.verified_counts?.[k] ?? fallback;}
function metricCard(icon,label,value,foot){
  return `<div class="metric-card"><div class="metric-top"><span>${esc(label)}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${esc(value)}</div><div class="metric-foot">${esc(foot)}</div></div>`;
}
function updateOverview(){
  const completed=state.journey.completed.length;
  const pct=Math.round(completed/28*100);
  $("#overviewMetrics").innerHTML=[
    metricCard("✳","أدوات قابلة للاستخدام",dataCount("tools"),"FOCUS TOOLS"),
    metricCard("◈","سجلات بنك الأفكار",dataCount("idea_bank_master").toLocaleString("en"),"4175 سجلًا رئيسيًا"),
    metricCard("▤","مصادر بحثية",dataCount("research_cards"),"بطاقات بحث موثقة بدرجات"),
    metricCard("↗","مسار التعلّم",`${completed}/28`,"يومًا من الرحلة أُنجز محليًا")
  ].join("");
  $("#journeyPct").textContent=pct+"%";
  $("#journeyRing").style.setProperty("--pct",pct+"%");
  $("#journeyCount").textContent=`${completed} / 28`;
  $("#weekBars").innerHTML=[0,1,2,3].map(w=>{
    const count=state.journey.completed.filter(d=>Math.ceil(d/7)===w+1).length;
    return `<span title="الأسبوع ${w+1}: ${count}/7"><i style="width:${count/7*100}%"></i></span>`;
  }).join("");
  const nextDay=Array.from({length:28},(_,i)=>i+1).find(x=>!state.journey.completed.includes(x));
  $("#nextMove").innerHTML=nextDay
    ? `<b>أكمل اليوم ${nextDay} من الرحلة</b><p>${esc(D.journey.find(x=>x.day===nextDay)?.title || "الخطوة التالية")} — خذ إجراءً واحدًا ثم سجّل المخرج.</p>`
    : `<b>أنهيت أيام الرحلة الـ28</b><p>راجع ما نجح معك واختر عادة واحدة للمحافظة عليها.</p>`;
}
function safeUrl(url){
  try { const u=new URL(url); return ["https:","http:"].includes(u.protocol) ? u.href : "#"; } catch{return "#";}
}
function renderMd(raw){
  let s=esc(String(raw??""));
  s=s.replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^# (.*)$/gm,'<h2>$1</h2>');
  s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
  s=s.replace(/`([^`]+)`/g,"<code>$1</code>");
  s=s.replace(/(^|\n)- (.*)/g,"$1<span class=\"md-bullet\">• $2</span>");
  s=s.replace(/\n{2,}/g,"</p><p>").replace(/\n/g,"<br>");
  return `<p>${s}</p>`;
}
function statusView(status){
  const map={
    blocked_attribution:["معلّق للتحقق","bad"],
    core_dossier_complete_selective_reading:["دراسة أساسية مع قراءة انتقائية","warn"],
    not_studied:["لم تبدأ الدراسة المعمقة",""],
    deep_study_card:["بطاقة دراسة — ليست قراءة كاملة",""],
    completed:["مكتمل",""],
    in_progress:["قيد الدراسة","warn"]
  };
  return map[status] || [status||"غير محدد",""];
}
function renderLearn(){
  const tabs=$$('.tab-row[data-tabs="learn"] .tab');
  tabs.forEach(x=>x.classList.toggle("active",x.dataset.tab===learnTab));
  const host=$("#learnContent");
  if(learnTab==="arabicBooks"){
    host.innerHTML=`<div class="card-grid">${D.arabic_books.map(b=>{
      const [label,cl]=statusView(b.status);
      return `<article class="data-card book-card ${b.status==="blocked_attribution"?"blocked":b.sequence===2?"complete":""}" data-book="${b.sequence}">
        <div class="card-meta"><span>المكتبة العربية / ${String(b.sequence).padStart(2,"0")}</span><span class="pill ${cl}">${esc(label)}</span></div>
        <div class="book-number">${String(b.sequence).padStart(2,"0")}</div><h3>${esc(b.title)}</h3><p>${esc(plain(b.note||b.body).slice(0,165))}…</p><div class="card-foot"><span>${esc(b.source||"الموسوعة الموحّدة")}</span><span>عرض الدراسة ↗</span></div>
      </article>`;
    }).join("")}</div><div id="bookDetail"></div><div class="disclaimer">تسلسل البحث يبدأ بمدخل معلّق يحتاج حسم النسبة والطبعة. «ذم الهوى» هو ثاني مدخل في القائمة وله ملف بحثي مستقل سابق؛ القراءة فيه انتقائية ولم يكتمل تخريج جميع الروايات أو تحليل جميع القصص.</div>`;
    $$(".book-card").forEach(c=>c.addEventListener("click",()=>showBook(Number(c.dataset.book))));
    if(selectedBook) showBook(selectedBook);
  } else if(learnTab==="westernWorks"){
    host.innerHTML=`<div class="card-grid">${D.western_works.map(w=>`<article class="data-card" data-detail="western" data-id="${w.sequence}"><div class="card-meta"><span>WORK ${String(w.sequence).padStart(2,"0")}</span><span class="pill">${esc(w.status||"ملف دراسة")}</span></div><h3>${esc(w.title)}</h3><p>${esc(plain(w.body).slice(0,190))}…</p><div class="card-foot"><span>درجة الاطلاع وحدود النقل</span><span>↗</span></div></article>`).join("")}</div><div id="learnDetail"></div>`;
  } else if(learnTab==="people"){
    host.innerHTML=`<div class="card-grid">${D.people.map(p=>`<article class="data-card" data-detail="people" data-id="${p.sequence}"><div class="card-meta"><span>PROFILE ${String(p.sequence).padStart(2,"0")}</span><span class="pill">ملف شخصية</span></div><h3>${esc(p.title)}</h3><p>${esc(plain(p.body).slice(0,185))}…</p><div class="card-foot"><span>السياق والأعمال والحدود</span><span>↗</span></div></article>`).join("")}</div><div id="learnDetail"></div>`;
  } else if(learnTab==="researchCards"){
    host.innerHTML=`<div class="filter-row"><input id="researchCardSearch" class="field search-field" placeholder="ابحث في البطاقات البحثية..."><select id="researchJudgment" class="field"><option value="all">كل مستويات الدليل</option><option value="A">A — أقوى/مدعوم</option><option value="B">B — متوسط/ملاحظة</option><option value="C">C — محدود/نظري</option></select></div><div class="card-grid" id="researchCardGrid"></div><div id="learnDetail"></div>`;
    const draw=()=>{
      const q=($("#researchCardSearch").value||"").toLowerCase(), j=$("#researchJudgment").value;
      const list=D.research_cards.filter(x=>(j==="all"||String(x.judgment).startsWith(j))&&(`${x.source_title} ${x.finding} ${x.limit}`).toLowerCase().includes(q));
      $("#researchCardGrid").innerHTML=list.map(x=>`<article class="data-card" data-detail="research" data-id="${x.id}"><div class="card-meta"><span>RESEARCH ${String(x.id).padStart(2,"0")}</span><span class="pill">${esc(x.judgment)}</span></div><h3>${esc(x.source_title)}</h3><p>${esc(plain(x.finding).slice(0,175))}…</p><div class="card-foot"><span>حدود الاستدلال موضحة</span><span>↗</span></div></article>`).join("")||`<div class="empty-state">لا توجد نتائج مطابقة.</div>`;
      bindDetailCards();
    };
    $("#researchCardSearch").addEventListener("input",draw); $("#researchJudgment").addEventListener("change",draw); draw();
  } else if(learnTab==="ideas"){
    host.innerHTML=`<div class="filter-row"><input id="learnIdeaSearch" class="field search-field" placeholder="ابحث داخل الأفكار الـ91..."><span class="pill">91 فكرة موثقة داخل المجلد</span></div><div id="learnIdeaGrid" class="card-grid"></div><div class="pagination" id="learnIdeaPag"></div>`;
    const draw=()=>{
      const q=($("#learnIdeaSearch").value||"").toLowerCase();
      const list=D.ideas.filter(x=>`${x.title} ${x.detail} ${x.try}`.toLowerCase().includes(q));
      const pages=Math.max(1,Math.ceil(list.length/24));learnIdeasPage=Math.min(learnIdeasPage,pages);
      const current=list.slice((learnIdeasPage-1)*24,learnIdeasPage*24);
      $("#learnIdeaGrid").innerHTML=current.map(x=>`<article class="data-card"><div class="card-meta"><span>IDEA ${esc(x.id)}</span><span class="pill">مفهوم / تطبيق</span></div><h3>${esc(x.title)}</h3><p>${esc(x.detail)}</p><div class="card-foot"><span>اقتراح تطبيق</span><span>${esc(x.try)}</span></div></article>`).join("")||`<div class="empty-state">لا توجد أفكار مطابقة.</div>`;
      $("#learnIdeaPag").innerHTML=`<button id="learnIdeaPrev" ${learnIdeasPage<=1?"disabled":""}>السابق</button><span>${list.length} فكرة · صفحة ${learnIdeasPage}/${pages}</span><button id="learnIdeaNext" ${learnIdeasPage>=pages?"disabled":""}>التالي</button>`;
      $("#learnIdeaPrev")?.addEventListener("click",()=>{learnIdeasPage--;draw();});
      $("#learnIdeaNext")?.addEventListener("click",()=>{learnIdeasPage++;draw();});
    };
    $("#learnIdeaSearch").addEventListener("input",()=>{learnIdeasPage=1;draw();}); draw();
  }
  bindDetailCards();
}
function showBook(seq){
  selectedBook=seq; const b=D.arabic_books.find(x=>x.sequence===seq); if(!b)return;
  const [label,cl]=statusView(b.status);
  const host=$("#bookDetail"); if(!host)return;
  const extra=seq===2?`<div class="detail-actions"><a class="btn btn-primary" href="library/ذم_الهوى_دراسة_بحثية.pdf" target="_blank">فتح التقرير البحثي PDF ↗</a><a class="btn btn-secondary" href="library/ذم_الهوى_المصادر.md" target="_blank">سجل المصادر ↗</a><a class="btn btn-secondary" href="library/ذم_الهوى_ملاحظات.md" target="_blank">الملاحظات ↗</a></div><div class="disclaimer">نطاق الدراسة: قراءة قريبة للأبواب 1–4 ومقاطع مختارة من 5–10، تحليل بنيوي للأبواب 11–34، وقراءة انتقائية للأبواب 35–50. لم تتم مقابلة المخطوطات مباشرة أو تخريج كل حديث أو تحليل قصص الأبواب 38–48 واحدةً واحدة.</div>`:"";
  host.innerHTML=`<div class="detail-panel"><div class="card-meta"><span>BOOK ${String(seq).padStart(2,"0")}</span><span class="pill ${cl}">${esc(label)}</span></div><h2>${esc(b.title)}</h2><div class="detail-body">${renderMd(b.body)}</div>${b.note?`<div class="callout">${esc(b.note)}</div>`:""}${extra}</div>`;
}
function bindDetailCards(){
  $$('[data-detail]').forEach(c=>{
    c.onclick=()=>{
      let item=null, kind=c.dataset.detail, id=Number(c.dataset.id);
      if(kind==="western") item=D.western_works.find(x=>x.sequence===id);
      if(kind==="people") item=D.people.find(x=>x.sequence===id);
      if(kind==="research") item=D.research_cards.find(x=>x.id===id);
      if(!item)return;
      const host=$("#learnDetail");
      const links=kind==="research"?(item.urls||[]).map(u=>`<a target="_blank" rel="noopener" href="${esc(safeUrl(u))}">${esc(new URL(safeUrl(u)).hostname)}</a>`).join(""):"";
      host.innerHTML=`<div class="detail-panel"><div class="card-meta"><span>${kind.toUpperCase()} / ${id}</span><span class="pill">${esc(item.status||item.judgment||"ملف دراسة")}</span></div><h2>${esc(item.title||item.source_title)}</h2><div class="detail-body">${renderMd(item.body||`**الخلاصة:** ${item.finding}\n\n**حدود الدليل:** ${item.limit}`)}</div>${kind==="research"?`<h4>مصادر التحقق</h4><div class="source-links">${links}</div><div class="callout"><strong>حدود الدليل:</strong> ${esc(item.limit)}</div>`:""}</div>`;
      host.scrollIntoView({behavior:"smooth",block:"nearest"});
    };
  });
}
function renderTools(){
  const q=($("#toolSearch")?.value||"").toLowerCase(), g=$("#toolGroup")?.value||"all";
  const groups={start:[1,2,5],plan:[3,4,6,7,8,9,10,11],execute:[12,13,14,15,16,17,18],recover:[19,20,23,24],learn:[21,22],reflect:[25,26]};
  const filtered=D.tools.filter(t=>(`${t.name} ${t.detail}`.toLowerCase().includes(q))&&(g==="all"||groups[g].includes(t.id)));
  $("#toolsGrid").innerHTML=filtered.map(t=>`<article class="tool-card" data-tool="${t.id}"><span class="tool-id">TOOL / ${String(t.id).padStart(2,"0")}</span><span class="tool-icon">${toolIcon(t.id)}</span><h3>${esc(t.name)}</h3><p>${esc(t.detail.split("—")[0])}</p><span class="tool-action">↗</span></article>`).join("")||`<div class="empty-state">لا توجد أداة بهذا الاسم.</div>`;
  $$(".tool-card").forEach(c=>c.addEventListener("click",()=>openTool(Number(c.dataset.tool))));
}
function toolIcon(id){return ["◷","◎","⇢","◇","▦","↗","◈","✦","⌁","⌘","▣","＋","▤","▥","◉","⊙","↩","◷","☼","☾","▧","⟳","⌂","⇥","↻","✉"][id-1]||"✳";}
const toolConfig={
1:["جلسة تركيز","اختَر ناتجًا واحدًا ومدة مناسبة. المؤقت يعمل داخل هذا المتصفح.",[["task","ما الناتج الذي تريد إنجازه؟","text"],["minutes","مدة الجلسة بالدقائق","select",["10","15","25","40","50"]]]],
2:["وقفة 60 ثانية","سمِّ ما يحدث الآن، ثم أعطِ نفسك لحظة قبل الاستجابة.",[["feeling","ما الشعور أو الدافع الحالي؟","text"],["need","ما الذي تحتاجه الآن؟","select",["هدوء","وضوح","حركة","ماء","استراحة","بداية صغيرة"]]]],
3:["خطة إذا — فسوف","اربط إشارة واضحة باستجابة صغيرة قابلة للتنفيذ.",[["cue","إذا حدث...","text"],["action","فسوف أفعل...","text"]]],
4:["الهوية والقيم","حوّل قيمة تؤمن بها إلى سلوك يمكن ملاحظته.",[["value","القيمة التي تريد تجسيدها","text"],["behavior","السلوك الذي يعبّر عنها اليوم","text"]]],
5:["فحص العادات الرقمية","قائمة فحص ذاتية؛ النتيجة ليست اختبارًا تشخيصيًا.",[["items","راجع البنود التالية","check",["أفتح الهاتف دون غرض واضح","الإشعارات تقطع العمل","أتنقل بين التطبيقات أثناء المهمة","أستخدم التمرير عند الملل","لا توجد نقطة توقف واضحة","أضع الهاتف بجوار مساحة العمل","التشغيل التلقائي يقودني للمحتوى التالي","لا أراجع وقت الشاشة أو نمطي"]]]],
6:["الخطوة الصغيرة التالية","حوّل الهدف العام إلى ناتج وخطوة افتتاحية قصيرة.",[["goal","الهدف الواسع","text"],["output","ما الناتج الملموس؟","text"],["time","الوقت المتاح الآن بالدقائق","select",["2","5","10","15"]]]],
7:["فرز الأهداف","صنّف أهدافك بوضوح: أساسي، داعم، أو مؤجل بدل إبقائها كلها على قائمة واحدة.",[["quarter","الهدف الرئيسي الحالي","text"],["support","الأهداف الداعمة — كل هدف في سطر","textarea"],["later","الأهداف المؤجلة أو غير النشطة — كل هدف في سطر","textarea"]]],
8:["خطة النتيجة والعائق","اربط النتيجة المرغوبة بأكبر عائق وخطة تعامل.",[["wish","ما النتيجة المهمة؟","text"],["outcome","أفضل نتيجة ممكنة","text"],["obstacle","العائق الداخلي المرجح","text"],["plan","إذا ظهر هذا العائق فسوف...","text"]]],
9:["فك شفرة التسويف","حدد الاحتكاك قبل الحكم على نفسك.",[["task","المهمة المؤجلة","text"],["reason","ما السبب الأقرب؟","select",["المهمة غير واضحة","خوف من التقييم أو الخطأ","ملل أو نفور","طاقة منخفضة","مشتت قريب","الموارد أو المعلومات غير متاحة","التزامات متعارضة","الحجم أكبر من الوقت"]]]],
10:["مسار الفكرة المتكررة","فرّق بين مشكلة تحتاج فعلًا وقلق يحتاج تهدئة أو تدوينًا.",[["thought","الفكرة التي تدور في ذهنك","textarea"],["route","أقرب مسار","select",["مشكلة قابلة للفعل","قلق خارج نطاق سيطرتي الآن","تفكير متكرر بلا خطوة جديدة"]]]],
11:["أهم ثلاثة اليوم","واحد أساسي ومهمتان داعمتان تكفي كبداية.",[["one","الأولوية الأساسية","text"],["two","مهمة داعمة 1","text"],["three","مهمة داعمة 2","text"]]],
12:["موقف الأفكار","أخرج الأفكار من الذاكرة العاملة دون تبديل مهمتك فورًا.",[["item","الفكرة أو المهمة التي تريد التقاطها","text"],["category","نوعها","select",["مهمة","فكرة","سؤال","موعد","متابعة"]]]],
13:["مجزّئ المهام","قسّم المهمة إلى أفعال تبدأ بأفعال واضحة.",[["task","المهمة الكبيرة","text"],["steps","خطوات أولية — كل خطوة في سطر","textarea"]]],
14:["مصفوفة الإلحاح والأهمية","هذا تصنيف عملي وليس حكمًا مطلقًا على كل الظروف.",[["task","المهمة","text"],["urgency","هل لها موعد/أثر زمني قريب؟","select",["نعم","لا"]],["importance","هل تخدم هدفًا مهمًا أو التزامًا جوهريًا؟","select",["نعم","لا"]]]],
15:["مطابقة الطاقة بالمهمة","استخدم تقديرك الشخصي للطاقة لا تصنيفًا طبيًا.",[["energy","طاقتك الآن","select",["منخفضة","متوسطة","مرتفعة"]],["taskType","نوع المهمة","select",["تفكير عميق","إداري/روتيني","إبداعي","تواصل","تعلم/مراجعة"]]]],
16:["سجل المشتتات","ارصد نمطًا واحدًا في كل مرة دون لوم.",[["trigger","ما الذي قطع انتباهك؟","text"],["response","ماذا فعلت بعدها؟","text"],["context","السياق أو الوقت","text"]]],
17:["ملاحظة استئناف العمل","اكتب نقطة التوقف كي لا تبدأ من الصفر لاحقًا.",[["stopped","أين توقفت؟","textarea"],["next","الخطوة التالية الدقيقة","text"],["file","الملف/الرابط/المكان المرتبط (اختياري)","text"]]],
18:["مخطط الوقت المحدد","أنشئ كتل عمل واستراحة متتابعة.",[["start","وقت البداية","time"],["count","عدد الكتل","select",["2","3","4","5","6"]],["work","مدة العمل بالدقائق","select",["20","25","40","50"]],["break","مدة الاستراحة بالدقائق","select",["5","10","15"]]]],
19:["اختيار الاستراحة","اختَر استراحة لا تزيد الحمل على الانتباه.",[["need","ما الذي تحتاجه؟","select",["تحريك الجسم","راحة للعين","هدوء","ماء/طعام","تغيير مكان","تواصل سريع"]],["minutes","المدة","select",["2","5","10","15"]]]],
20:["حاسبة وقت النوم","احسب وقتًا تقريبيًا من مدة نوم تختارها بنفسك؛ ليست توصية طبية.",[["wake","وقت الاستيقاظ","time"],["hours","مدة النوم التي تريد حسابها","select",["6.5","7","7.5","8","8.5","9","9.5"]]]],
21:["بطاقة الاسترجاع النشط","اكتب السؤال أولًا، ثم حاول الإجابة قبل الكشف.",[["question","السؤال","textarea"],["answer","الإجابة النموذجية / النقاط الأساسية","textarea"]]],
22:["جدول المراجعة المتباعدة","أنشئ تواريخ مراجعة مرنة من تاريخ بداية تختاره.",[["topic","الموضوع","text"],["start","تاريخ البداية","date"]]],
23:["تجهيز البيئة","قائمة تحضير قبل جلسة التركيز.",[["items","تحقق من البيئة","check",["أزلت ما لا أحتاجه من سطح العمل","وضعت الهاتف خارج مجال الوصول أو على الصامت","فتحت الملف/المصدر المطلوب","حددت ناتج الجلسة","حضّرت الماء/الأدوات","أبلغت من حولي بحدود المقاطعة عند الحاجة"]]]],
24:["روتين إغلاق اليوم","أغلق الحلقة وسهّل بداية الغد.",[["items","خطوات الإغلاق","check",["حفظت العمل وأغلقت الملفات بأمان","سجلت ما تم إنجازه","نقلت المفتوح إلى قائمة واضحة","كتبت أول خطوة للغد","أبعدت المشتتات من مساحة النوم/الراحة"]],["tomorrow","أول خطوة غدًا","text"]]],
25:["المراجعة الأسبوعية","راجع الخطة والنتائج والعوائق ثم عدّل شيئًا واحدًا.",[["planned","ما الذي خططت له؟","textarea"],["done","ما الذي أُنجز؟","textarea"],["friction","ما العائق المتكرر؟","textarea"],["lesson","ما الذي تعلمته؟","textarea"],["next","ما التغيير الصغير للأسبوع القادم؟","textarea"]]],
26:["رسالة حدود التركيز","أنشئ رسالة مهذبة توضّح وقت التوفر وطريقة الوصول.",[["name","اسم الشخص (اختياري)","text"],["hours","وقت عدم التوفر","text"],["channel","القناة البديلة للطوارئ","text"],["tone","نبرة الرسالة","select",["ودية","مهنية","مختصرة"]]]]
};
function fieldHtml(f){
 const [name,label,type,opts]=f;
 if(type==="check") return `<div class="full"><label>${esc(label)}</label><div class="check-list">${opts.map((x,i)=>`<label><input type="checkbox" name="${name}" value="${esc(x)}"> ${esc(x)}</label>`).join("")}</div></div>`;
 if(type==="select") return `<label>${esc(label)}<select class="field" name="${name}">${opts.map(x=>`<option>${esc(x)}</option>`).join("")}</select></label>`;
 const input=type==="textarea"?`<textarea class="field" name="${name}" rows="3" placeholder="${esc(label)}"></textarea>`:`<input class="field" type="${type==="time"?"time":type==="date"?"date":"text"}" name="${name}" placeholder="${esc(label)}">`;
 return `<label class="${type==="textarea"?"full":""}">${esc(label)}${input}</label>`;
}
function openTool(id){
 const tool=D.tools.find(x=>x.id===id), cfg=toolConfig[id]; if(!tool||!cfg)return;
 currentTool=id; clearInterval(timerHandle); timerHandle=null;
 $("#modalTitle").textContent=tool.name; $("#modalDescription").textContent=cfg[1];
 $("#modalBody").innerHTML=`<form id="toolForm" data-id="${id}"><div class="tool-form-grid">${cfg[2].map(fieldHtml).join("")}</div><div class="button-row"><button class="btn btn-primary" type="submit">${id===1?"ابدأ الجلسة":id===21?"أنشئ بطاقة": "ولّد المخرج"} <span>↗</span></button>${[12,16].includes(id)?`<button class="btn btn-secondary" type="button" id="viewToolLog">عرض السجل</button>`:""}</div></form><div id="toolResult"></div>`;
 $("#toolModal").classList.add("open"); $("#toolModal").setAttribute("aria-hidden","false");
 $("#toolForm").addEventListener("submit",runTool);
 $("#viewToolLog")?.addEventListener("click",()=>showToolLog(id));
}
function formValues(form){
 const out={};
 for(const [k,v] of new FormData(form).entries()){
   if(out[k]===undefined)out[k]=v; else out[k]=Array.isArray(out[k])?[...out[k],v]:[out[k],v];
 }
 form.querySelectorAll('input[type="checkbox"]').forEach(el=>{if(!out[el.name])out[el.name]=[];});
 return out;
}
function box(content){return `<div class="result-box">${content}<button type="button" class="btn btn-secondary copy-tool-output">نسخ النتيجة</button></div>`;}
function runTool(e){
 e.preventDefault(); const f=e.currentTarget,id=Number(f.dataset.id),v=formValues(f); let html="",textOut="";
 const checks=(name)=>v[name]||[];
 const saveTool=(k,val)=>{state.toolData[k]=val;persist();};
 switch(id){
  case 1:{
   const mins=Math.max(1,Number(v.minutes||25)); timerInitial=mins*60;timerSeconds=timerInitial;timerPaused=false;
   html=box(`<h4>جلسة ${mins} دقيقة</h4><b>${esc(v.task||"جلسة تركيز")}</b><div class="timer-display" id="timerDisplay">${fmtTime(timerSeconds)}</div><div class="button-row"><button type="button" class="btn btn-primary" id="timerToggle">ابدأ المؤقت</button><button type="button" class="btn btn-secondary" id="timerReset">إعادة</button></div><p>حافظ على ناتج واحد. عند الانتهاء سجّل ما أُنجز وما الخطوة التالية.</p>`);
   $("#toolResult").innerHTML=html; $("#timerToggle").onclick=toggleTimer; $("#timerReset").onclick=resetTimer; return;
  }
  case 2:{
   timerInitial=60;timerSeconds=60;timerPaused=false;
   html=box(`<h4>وقفة لمدة دقيقة</h4><p>الشعور: <strong>${esc(v.feeling||"غير محدد")}</strong><br>الاحتياج: <strong>${esc(v.need||"غير محدد")}</strong></p><div class="timer-display" id="timerDisplay">01:00</div><button type="button" class="btn btn-primary" id="timerToggle">ابدأ الوقفة</button>`);
   $("#toolResult").innerHTML=html;$("#timerToggle").onclick=toggleTimer;return;
  }
  case 3: textOut=`إذا ${v.cue||"[الإشارة]"}، فسوف ${v.action||"[الاستجابة]"}.`; break;
  case 4: textOut=`القيمة: ${v.value}\nالسلوك المرئي اليوم: ${v.behavior}\nسؤال المراجعة: ما الدليل الصغير الذي سأراه في نهاية اليوم؟`; break;
  case 5: textOut=`راجعت ${checks("items").length} من 8 بنود.\nهذه لقطة وصفية لعاداتك اليوم، وليست درجة نجاح أو تشخيصًا.`; break;
  case 6: textOut=`الهدف: ${v.goal}\nالناتج: ${v.output}\nأصغر خطوة لمدة ${v.time} دقائق: افتح المورد المرتبط بالناتج، ثم نفّذ فعلًا واحدًا يمكن رؤيته أو حفظه.`; break;
  case 7:{const support=(v.support||"").split("\n").map(x=>x.trim()).filter(Boolean),later=(v.later||"").split("\n").map(x=>x.trim()).filter(Boolean); textOut=`الهدف الرئيسي الحالي:\n• ${v.quarter||"لم تحدد هدفًا رئيسيًا"}\n\nالأهداف الداعمة (${support.length}):\n${support.map(x=>"• "+x).join("\n")||"• لا يوجد"}\n\nالمؤجلة/غير النشطة (${later.length}):\n${later.map(x=>"• "+x).join("\n")||"• لا يوجد"}\n\nراجع أن الأهداف الداعمة تخدم الهدف الرئيسي فعلًا، وأن المؤجل قرار واعٍ لا قائمة نسيان.`;break;}
  case 8: textOut=`الرغبة: ${v.wish}\nأفضل نتيجة: ${v.outcome}\nالعائق المرجح: ${v.obstacle}\nالخطة إذا ظهر العائق: ${v.plan}`;break;
  case 9:{
   const advice={
    "المهمة غير واضحة":"اكتب فعلًا يبدأ به العمل، ومخرجًا واحدًا، وتعريفًا لما يعنيه الانتهاء.",
    "خوف من التقييم أو الخطأ":"أنشئ نسخة أولى خاصة غير نهائية، وحدد معيارًا واحدًا للتحسين.",
    "ملل أو نفور":"قلّص البداية إلى 5 دقائق أو بدّل ترتيب المهام دون إلغاء الالتزام.",
    "طاقة منخفضة":"اختر مهمة أقل حملًا أو راجع احتياجك للراحة والموارد.",
    "مشتت قريب":"أبعد المثير لدورة عمل واحدة بدل الاعتماد على المقاومة فقط.",
    "الموارد أو المعلومات غير متاحة":"حوّل الخطوة إلى طلب مورد/سؤال محدد بدل الدوران حول المهمة.",
    "التزامات متعارضة":"راجع الأولويات والموعد، ثم تفاوض أو أعد تحديد النطاق.",
    "الحجم أكبر من الوقت":"قسّم الناتج إلى نسخة أصغر قابلة للتسليم."
   };
   textOut=`المهمة: ${v.task}\nالاحتكاك المحتمل: ${v.reason}\n\nاستجابة تجريبية: ${advice[v.reason]||"حدّد العائق القابل للتغيير."}`;break;
  }
  case 10:{
   const map={"مشكلة قابلة للفعل":"اكتب أصغر فعل يمكن تنفيذه، وموعدًا وموردًا تحتاجه. حوّل التفكير إلى خطوة أو قرار.","قلق خارج نطاق سيطرتي الآن":"سمِّ ما لا تملكه، وسجّل ما يمكنك فعله لاحقًا. ارجع إلى مهمة حاضرة أو خذ استراحة هادئة.","تفكير متكرر بلا خطوة جديدة":"أوقف إعادة التحليل مؤقتًا: اكتب الفكرة مرة واحدة، وما الدليل الجديد الذي سيغير القرار، ثم حدد وقت مراجعة."};
   textOut=`الفكرة: ${v.thought}\nالمسار: ${v.route}\n\n${map[v.route]}`;break;
  }
  case 11: textOut=`أولوية اليوم: ${v.one}\nدعم 1: ${v.two}\nدعم 2: ${v.three}\n\nابدأ بالأولوية الأساسية، ولا تضف رابعة قبل مراجعة التقدم.`;break;
  case 12:{
   const arr=state.toolData.parking||[];arr.unshift({id:Date.now(),item:v.item,category:v.category,at:nowISO()});saveTool("parking",arr.slice(0,100));
   textOut=`تم التقاط العنصر في موقف الأفكار المحلي.\n${arr.length} عناصر محفوظة في هذا المتصفح.`;break;
  }
  case 13:{
   const steps=(v.steps||"").split("\n").map(x=>x.trim()).filter(Boolean);
   textOut=`المهمة: ${v.task}\n\n${steps.map((s,i)=>`${i+1}. ${s}`).join("\n")||"ابدأ بخطوة واحدة صغيرة."}\n\nحوّل كل خطوة إلى مهمة مستقلة يمكن إغلاقها.`;break;
  }
  case 14:{
   const u=v.urgency==="نعم", im=v.importance==="نعم";
   const labels={"true,true":"أنجز أو عالج سريعًا مع حماية الجودة.","false,true":"جدولها في وقت محمي؛ لا تترك المهم بلا موعد.","true,false":"فوّض أو قلّل نطاقها أو تحقق من ضرورة الاستجابة.","false,false":"أجّلها أو احذفها بعد مراجعة الالتزامات."};
   textOut=`المهمة: ${v.task}\nالتصنيف: ${im?"مهمة":"أقل أهمية"} / ${u?"عاجلة":"غير عاجلة"}\n\nالاتجاه المقترح: ${labels[`${u},${im}`]}\n\nتذكر أن المصفوفة أداة فرز وليست بديلًا عن السياق أو الالتزامات الفعلية.`;break;
  }
  case 15:{
   const rec={
    "منخفضة":{"تفكير عميق":"أجّل الجزء عالي الحمل أو صغّره إلى 10 دقائق.","إداري/روتيني":"اختر مهمة قصيرة محددة ذات نهاية واضحة.","إبداعي":"التقط الأفكار دون إجبار نفسك على إخراج نهائي.","تواصل":"أنجز رسالة بسيطة أو أجّل المحادثة المعقدة.","تعلم/مراجعة":"استخدم مراجعة قصيرة أو استرجاعًا واحدًا."},
    "متوسطة":{"تفكير عميق":"نفّذ كتلة واحدة 25 دقيقة مع تقليل المقاطعات.","إداري/روتيني":"اجمع الأعمال المتشابهة في دفعة واحدة.","إبداعي":"اصنع مسودة أولى دون تقييم مبكر.","تواصل":"رتّب محادثة محددة بقرار أو مخرج.","تعلم/مراجعة":"نفّذ استرجاعًا نشطًا ثم راجع الفجوات."},
    "مرتفعة":{"تفكير عميق":"ضع المهمة الأصعب في كتلة محمية.","إداري/روتيني":"أغلق دفعة مهام ثم عد إلى الأولوية الأساسية.","إبداعي":"استثمر الطاقة في إنتاج نسخة قابلة للمراجعة.","تواصل":"أنجز تواصلًا يحتاج تركيزًا وتنسيقًا.","تعلم/مراجعة":"استخدم جلسة تعلم نشطة لا قراءة سلبية فقط."}
   };
   textOut=`الطاقة: ${v.energy}\nنوع المهمة: ${v.taskType}\n\nاقتراح: ${rec[v.energy][v.taskType]}\n\nهذا تنظيم ذاتي وليس قياسًا فسيولوجيًا للطاقة.`;break;
  }
  case 16:{
   const arr=state.toolData.distractions||[];arr.unshift({id:Date.now(),trigger:v.trigger,response:v.response,context:v.context,at:nowISO()});saveTool("distractions",arr.slice(0,100));
   textOut=`تم حفظ الملاحظة محليًا.\nالمحفز: ${v.trigger}\nالاستجابة: ${v.response}\nالسياق: ${v.context}\n\nابحث عن نمط متكرر قبل تغيير النظام.`;break;
  }
  case 17:textOut=`توقفت عند: ${v.stopped}\nالخطوة التالية: ${v.next}\nالمكان/الملف: ${v.file||"غير محدد"}\n\nملاحظة الاستئناف: "${v.next}"`;break;
  case 18:{
   let [hh,mm]=(v.start||"09:00").split(":").map(Number);let t=hh*60+mm,rows=[];
   for(let i=0;i<Number(v.count);i++){rows.push(`${fmtClock(t)}–${fmtClock(t+Number(v.work))} · عمل`);t+=Number(v.work);if(i<Number(v.count)-1){rows.push(`${fmtClock(t)}–${fmtClock(t+Number(v.break))} · استراحة`);t+=Number(v.break);}}
   textOut=`جدول مقترح:\n${rows.join("\n")}\n\nراجع المواعيد الواقعية والتزاماتك قبل اعتمادها.`;break;
  }
  case 19:{
   const activities={"تحريك الجسم":"قف وامشِ قليلًا أو حرّك المفاصل بلطف.","راحة للعين":"أبعد النظر عن الشاشة وانظر إلى مسافة بعيدة.","هدوء":"اجلس بهدوء وخفّض المدخلات الحسية.","ماء/طعام":"اشرب ماءً أو تناول ما يناسب احتياجك.","تغيير مكان":"انتقل إلى مكان مناسب لبقية العمل.","تواصل سريع":"أرسل رسالة قصيرة لشخص تحتاج التواصل معه ثم عد."};
   textOut=`استراحة ${v.minutes} دقائق — ${v.need}\n\n${activities[v.need]}\n\nحدّد نهاية للاستراحة قبل البدء.`;break;
  }
  case 20:{
   const [h,m]=(v.wake||"07:00").split(":").map(Number);let mins=(h*60+m)-Number(v.hours)*60;mins=(mins+1440)%1440;
   textOut=`وقت الاستيقاظ: ${v.wake}\nمدة النوم التي اخترتها: ${v.hours} ساعة\nموعد النوم الحسابي التقريبي: ${fmtClock(mins)}\n\nهذه عملية حسابية فقط وليست تقييمًا لاحتياجك الصحي؛ قد تختلف الاحتياجات الفردية، ولا تعالج مشكلات النوم أو تشخّصها.`;break;
  }
  case 21:{
   const id=Date.now();saveTool("recallCard",{id,question:v.question,answer:v.answer});
   html=box(`<h4>بطاقة استرجاع جاهزة</h4><div class="recall-question">${esc(v.question)}</div><button type="button" class="btn btn-secondary" id="revealAnswer">اكشف الإجابة</button><div id="recallAnswer" hidden>${esc(v.answer)}</div>`);
   $("#toolResult").innerHTML=html;$("#revealAnswer").onclick=()=>{$("#recallAnswer").hidden=false;};return;
  }
  case 22:{
   const start=new Date((v.start||new Date().toISOString().slice(0,10))+"T12:00:00");
   const dates=[0,1,3,7,14,30].map(d=>{let x=new Date(start);x.setDate(x.getDate()+d);return `اليوم ${d}: ${x.toLocaleDateString("ar-EG")}`;});
   textOut=`الموضوع: ${v.topic}\n\n${dates.join("\n")}\n\nالمواعيد المقترحة قابلة للتعديل؛ غيّرها وفق صعوبة الموضوع ونتائج الاسترجاع.`;break;
  }
  case 23:textOut=`أكملت ${checks("items").length} من 6 عناصر تجهيز.\nاستخدمها لتقليل الاحتكاك قبل جلسة واحدة، لا كقائمة مثالية يجب إكمالها كل مرة.`;break;
  case 24:textOut=`خطوات الإغلاق: ${checks("items").length} من 5\nأول خطوة للغد: ${v.tomorrow}\n\nاكتب أول فعل قابل للتنفيذ وليس عنوانًا عامًا.`;break;
  case 25:{
   const review={id:Date.now(),at:nowISO(),planned:v.planned,done:v.done,friction:v.friction,lesson:v.lesson,next:v.next};
   state.weeklyReviews.unshift(review);persist();
   textOut=`المخطط: ${v.planned}\nالمنجز: ${v.done}\nالاحتكاك: ${v.friction}\nالدرس: ${v.lesson}\nالتعديل التالي: ${v.next}`;
   break;
  }
  case 26:{
   const name=v.name?`مرحبًا ${v.name}،`:"مرحبًا،";
   const text=`${name}\nأنا في وقت تركيز من ${v.hours||"الوقت المحدد"}، وقد أتأخر في الرد على الرسائل غير العاجلة.\nلأمر عاجل، يمكنك التواصل عبر ${v.channel||"القناة المعتادة"}.\nشكرًا لتفهمك — سأعود للمتابعة بمجرد انتهاء هذه الفترة.`;
   textOut=`<div class="message-preview">${esc(text)}</div><button class="btn btn-secondary" type="button" id="copyMessage">نسخ الرسالة</button>`;
   $("#toolResult").innerHTML=box(textOut);$("#copyMessage").onclick=()=>copyText(text);return;
  }
 }
 if(!html) $("#toolResult").innerHTML=box(`<h4>المخرج المقترح</h4>${esc(textOut)}`);
}
function fmtTime(n){return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;}
function fmtClock(n){n=(n+1440)%1440;return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;}
function toggleTimer(){
 const btn=$("#timerToggle");if(!btn)return;
 if(timerHandle){clearInterval(timerHandle);timerHandle=null;timerPaused=true;btn.textContent="استئناف المؤقت";return;}
 timerPaused=false;btn.textContent="إيقاف مؤقت";
 timerHandle=setInterval(()=>{
   timerSeconds=Math.max(0,timerSeconds-1);const disp=$("#timerDisplay");if(disp)disp.textContent=fmtTime(timerSeconds);
   if(timerSeconds<=0){clearInterval(timerHandle);timerHandle=null;btn.textContent="انتهت الجلسة";toast("انتهى الوقت. سجّل نتيجة الجلسة.");}
 },1000);
}
function resetTimer(){clearInterval(timerHandle);timerHandle=null;timerSeconds=timerInitial;timerPaused=false;$("#timerDisplay").textContent=fmtTime(timerSeconds);$("#timerToggle").textContent="ابدأ المؤقت";}
function showToolLog(id){
 const key=id===12?"parking":"distractions", rows=state.toolData[key]||[];
 $("#toolResult").innerHTML=box(`<h4>السجل المحلي · ${rows.length} عناصر</h4>${rows.slice(0,20).map(x=>`• ${esc(x.item||x.trigger||"")}${x.category?" — "+esc(x.category):""}${x.response?" ← "+esc(x.response):""}`).join("<br>")||"لا توجد عناصر بعد."}`);
}
function closeTool(){clearInterval(timerHandle);timerHandle=null;$("#toolModal").classList.remove("open");$("#toolModal").setAttribute("aria-hidden","true");}
function copyText(text){
 if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(()=>toast("تم النسخ")).catch(()=>fallbackCopy(text));
 else fallbackCopy(text);
}
function fallbackCopy(text){const t=document.createElement("textarea");t.value=text;document.body.append(t);t.select();try{document.execCommand("copy");toast("تم النسخ");}catch{toast("تعذر النسخ التلقائي");}t.remove();}

function renderJourney(){
 const completed=state.journey.completed.length,pct=Math.round(completed/28*100);
 $("#journeyHeaderPct").textContent=pct+"%";$("#jCompleted").textContent=completed;$("#jRemaining").textContent=28-completed;
 $("#journeyStart").value=state.journey.startDate||"";
 const titles=["الوعي وتقليل الضوضاء","اتجاه وأولويات","تنفيذ ومقاومة التسويف","الاستمرارية والمراجعة"];
 const desc=["افهم نمط الانتباه والمثيرات حولك.","اختر ما يستحق وقتك واربطه بهدف.","ابدأ وقلل الاحتكاك وقسّم العمل.","ثبّت ما نفعك وعدّل ما لم يعمل."];
 $("#journeyWeeks").innerHTML=[0,1,2,3].map(w=>{
   const days=D.journey.filter(x=>Math.ceil(x.day/7)===w+1),count=days.filter(x=>state.journey.completed.includes(x.day)).length;
   return `<div class="week-card ${Math.ceil(selectedJourneyDay/7)===w+1?"active":""}"><div class="week-label">WEEK ${String(w+1).padStart(2,"0")} · ${count}/7</div><h3>${titles[w]}</h3><p>${desc[w]}</p><div class="week-progress"><i style="width:${count/7*100}%"></i></div><div class="day-grid">${days.map(d=>`<button class="day-button ${state.journey.completed.includes(d.day)?"done":""} ${selectedJourneyDay===d.day?"selected":""}" data-day="${d.day}"><b>${String(d.day).padStart(2,"0")}</b>اليوم</button>`).join("")}</div></div>`;
 }).join("");
 $$(".day-button").forEach(b=>b.addEventListener("click",()=>{selectedJourneyDay=Number(b.dataset.day);state.journey.selectedDay=selectedJourneyDay;persist();renderJourney();showJourneyDay(selectedJourneyDay);}));
 showJourneyDay(selectedJourneyDay);
}
function showJourneyDay(day){
 const d=D.journey.find(x=>x.day===day);if(!d)return;
 const done=state.journey.completed.includes(day),note=state.journey.notes[day]||"";
 let dateLabel="";
 if(state.journey.startDate){
   const dt=new Date(state.journey.startDate+"T12:00:00");dt.setDate(dt.getDate()+day-1);
   dateLabel=dt.toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"});
 }
 $("#journeyDayDetail").innerHTML=`<div class="panel-head"><div><span class="panel-kicker">DAY ${String(day).padStart(2,"0")} / 28 ${dateLabel?"· "+esc(dateLabel):""}</span><h3>${esc(plain(d.title))}</h3></div><span class="status-tag ${done?"amber":"muted"}">${done?"تم الإنجاز":"لم يكتمل بعد"}</span></div><div class="day-detail-row"><div class="detail-box"><span>الإجراء المطلوب</span><b>${esc(d.action)}</b></div><div class="detail-box"><span>المخرج المتوقع</span><b>${esc(d.output)}</b></div></div><label class="stack-form">ملاحظتك أو ما تعلمته<textarea id="journeyNote" class="field" rows="3" placeholder="اكتب ما حدث بالفعل...">${esc(note)}</textarea></label><div class="detail-actions"><button class="btn ${done?"btn-secondary":"btn-primary"}" id="toggleDay">${done?"إلغاء اكتمال اليوم":"تسجيل اليوم كمكتمل"}</button><button class="btn btn-secondary" id="saveDayNote">حفظ الملاحظة</button></div>`;
 $("#toggleDay").onclick=()=>{
   if(done) state.journey.completed=state.journey.completed.filter(x=>x!==day);
   else state.journey.completed.push(day);
   state.journey.completed.sort((a,b)=>a-b);state.journey.notes[day]=$("#journeyNote").value;persist();renderJourney();toast(done?"تم إلغاء اكتمال اليوم":"تم حفظ إنجاز اليوم");
 };
 $("#saveDayNote").onclick=()=>{state.journey.notes[day]=$("#journeyNote").value;persist();toast("تم حفظ ملاحظة اليوم");};
}
function renderMastery(){
 const stages=["Capture","Clarify","Select","Define","Plan","Prepare","Execute","Close","Review"];
 $("#masteryFlow").innerHTML=stages.map((x,i)=>`<div class="mastery-stage"><b>${String(i+1).padStart(2,"0")}</b>${x}</div>`).join("");
 const open=state.tasks.filter(x=>!x.done).length;$("#taskCount").textContent=open;
 const list=state.tasks.filter(t=>taskFilter==="all"|| (taskFilter==="open"?!t.done:t.done));
 $("#taskList").innerHTML=list.map(t=>`<div class="task-item"><button class="task-check ${t.done?"done":""}" data-taskdone="${t.id}">${t.done?"✓":""}</button><div><h4>${esc(t.title)}</h4><p>${esc(t.next||"لا توجد خطوة تالية محددة بعد.")}</p><div class="task-meta"><span class="pill">${esc(t.stage)}</span><span class="priority ${esc(t.priority)}">${t.priority==="high"?"عالية":t.priority==="low"?"منخفضة":"متوسطة"}</span>${t.due?`<span class="pill">${esc(t.due)}</span>`:""}</div></div><div class="task-actions"><button data-taskstage="${t.id}">نقل</button><button data-taskdelete="${t.id}">حذف</button></div></div>`).join("")||`<div class="empty-state">لا توجد مهام في هذا العرض. أضف مهمة أو غيّر الفلتر.</div>`;
 $$("[data-taskdone]").forEach(b=>b.onclick=()=>{const t=state.tasks.find(x=>x.id===Number(b.dataset.taskdone));if(t){t.done=!t.done;t.completedAt=t.done?nowISO():null;persist();renderMastery();}});
 $$("[data-taskdelete]").forEach(b=>b.onclick=()=>{state.tasks=state.tasks.filter(x=>x.id!==Number(b.dataset.taskdelete));persist();renderMastery();toast("تم حذف المهمة");});
 $$("[data-taskstage]").forEach(b=>b.onclick=()=>{const stages=["Capture","Clarify","Select","Define","Plan","Prepare","Execute","Close","Review"];const t=state.tasks.find(x=>x.id===Number(b.dataset.taskstage));if(t){t.stage=stages[(stages.indexOf(t.stage)+1)%stages.length];persist();renderMastery();toast("تم نقل المهمة إلى "+t.stage);}});
 $("#weeklyHistory").innerHTML=state.weeklyReviews.slice(0,3).map(r=>`<div class="history-item"><b>${new Date(r.at).toLocaleDateString("ar-EG")}</b><br>التعديل: ${esc(r.next||"غير محدد")}</div>`).join("")||`<div class="empty-state">لا توجد مراجعات محفوظة.</div>`;
}
function renderTafra(){
 const tabs=$$('.tab-row[data-tabs="tafra"] .tab');tabs.forEach(x=>x.classList.toggle("active",x.dataset.tab===tafraTab));
 $("#tafraStats").innerHTML=[
   ["4,175","كل السجلات"],["2,051","قائمة منتقاة"],["3,936","مجموعة TAFRA"],["200","سجل موسوعة الريلز"],["60","Hero Ideas"],["336","Story Entries"]
 ].map(x=>`<div class="content-stat"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
 const host=$("#tafraContent");
 if(tafraTab==="bank") renderIdeaBank();
 else if(tafraTab==="hero") renderSheetCards("06C_60_Hero_Ideas_V3","Hero Ideas");
 else if(tafraTab==="reels") renderSheetCards("06_الـ60_ريل_التنفيذ","60 Reel Execution");
 else if(tafraTab==="stories") renderSheetCards("07_ستوري_84_يوم","84-Day Story System");
 else if(tafraTab==="carousels") renderSheetCards("08_24_كاروسيل","24 Carousel");
 else if(tafraTab==="youtube") renderSheetCards("09_يوتيوب_12_حلقة","12 YouTube Episodes");
 else if(tafraTab==="campaigns") renderSheetCards("07_Final_30_Campaigns","30 Campaigns");
 else if(tafraTab==="reelIndex") renderSheetCards("15_موسوعة_600_ريل","موسوعة الريلز — 200 سجل فعلي");
 else if(tafraTab==="calendar") renderSheetCards("08_Weekly_Calendar_FINAL","Weekly Calendar");
 else if(tafraTab==="sheets") renderAllSheets();
 else if(tafraTab==="analytics") renderAnalytics();
}
function renderIdeaBank(){
 const rows=D.content_bank||[];
 const niches=[...new Set(rows.map(x=>x["النيش الرئيسي"]).filter(Boolean))].sort();
 const formats=[...new Set(rows.map(x=>x["نوع المحتوى"]).filter(Boolean))].sort();
 $("#tafraContent").innerHTML=`<div class="data-toolbar"><input class="field" id="bankSearch" placeholder="ابحث بالعنوان أو الهوك أو الجمهور أو التوجيه..." value="${esc(bankSearch)}"><select class="field" id="bankSet"><option value="all">كل 4,175 سجل</option><option value="curated">المنتقى 2,051</option><option value="taf ra">بنك TAFRA 3,936</option></select><select class="field" id="bankFormat"><option value="all">كل الصيغ</option>${formats.map(x=>`<option>${esc(x)}</option>`).join("")}</select><select class="field" id="bankNiche"><option value="all">كل المجالات</option>${niches.map(x=>`<option>${esc(x)}</option>`).join("")}</select><button class="btn btn-secondary" id="exportBank">تصدير النتائج CSV ↓</button></div><div class="muted-text" id="bankCount"></div><div class="idea-grid" id="bankGrid"></div><div class="pagination" id="bankPagination"></div><div id="bankDetail"></div>`;
 $("#bankSet").value=bankSet==="taf ra"?"taf ra":bankSet;
 $("#bankFormat").value=bankFormat;$("#bankNiche").value=bankNiche;
 const redraw=()=>{bankSearch=$("#bankSearch").value.toLowerCase();bankSet=$("#bankSet").value;bankFormat=$("#bankFormat").value;bankNiche=$("#bankNiche").value;bankPage=1;drawBank();};
 ["bankSearch","bankSet","bankFormat","bankNiche"].forEach(id=>$("#"+id).addEventListener(id==="bankSearch"?"input":"change",redraw));
 $("#exportBank").onclick=exportFilteredBank;
 drawBank();
}
function currentBank(){
 return (D.content_bank||[]).filter(x=>{
   const text=Object.values(x).filter(v=>typeof v==="string"||typeof v==="number").join(" ").toLowerCase();
   return (!bankSearch||text.includes(bankSearch))&&
     (bankSet==="all"||(bankSet==="curated"&&x.curated_2051)||(bankSet==="taf ra"&&x.tafra_all_3936))&&
     (bankFormat==="all"||x["نوع المحتوى"]===bankFormat)&&
     (bankNiche==="all"||x["النيش الرئيسي"]===bankNiche);
 });
}
function drawBank(){
 const list=currentBank(), total=list.length, pages=Math.max(1,Math.ceil(total/bankPageSize));
 bankPage=Math.min(bankPage,pages);
 $("#bankCount").textContent=`${total.toLocaleString("en")} نتيجة · عرض ${((bankPage-1)*bankPageSize+1).toLocaleString("en")}–${Math.min(total,bankPage*bankPageSize).toLocaleString("en")} · السجل الرئيسي دون تكرار الصفوف الفرعية`;
 const subset=list.slice((bankPage-1)*bankPageSize,bankPage*bankPageSize);
 $("#bankGrid").innerHTML=subset.map((x,i)=>`<article class="idea-row"><div class="card-meta"><span>${esc(x["ID"]||"")}</span><span>${esc(x["نوع المحتوى"]||"")}</span></div><h4>${esc(x["اسم الفكرة"]||"فكرة بدون عنوان")}</h4><p>${esc(x["النيش الرئيسي"]||"")} · ${esc(x["النيش الفرعي"]||"")}</p><div class="idea-hook">${esc(x["الهوك (أول 3 ثواني)"]||"لا يوجد Hook مسجل")}</div><div class="card-foot"><span>${esc(x["الجمهور المستهدف"]||"")}</span><button class="text-link" data-bankdetail="${esc(x["ID"])}">تفاصيل ↗</button></div></article>`).join("")||`<div class="empty-state">لا توجد نتائج مطابقة.</div>`;
 $("#bankPagination").innerHTML=`<button ${bankPage<=1?"disabled":""} id="bankPrev">السابق</button><span>صفحة ${bankPage} من ${pages}</span><button ${bankPage>=pages?"disabled":""} id="bankNext">التالي</button>`;
 $("#bankPrev")?.addEventListener("click",()=>{bankPage--;drawBank();});
 $("#bankNext")?.addEventListener("click",()=>{bankPage++;drawBank();});
 $$("[data-bankdetail]").forEach(b=>b.onclick=()=>showBankDetail(b.dataset.bankdetail));
}
function showBankDetail(id){
 const x=D.content_bank.find(r=>r["ID"]===id);if(!x)return;
 $("#bankDetail").innerHTML=`<div class="detail-panel"><div class="card-meta"><span>${esc(x["ID"])}</span><span class="pill">${esc(x["نوع المحتوى"])}</span></div><h2>${esc(x["اسم الفكرة"])}</h2><div class="grid2"><div class="detail-box"><span>Hook</span><b>${esc(x["الهوك (أول 3 ثواني)"])}</b></div><div class="detail-box"><span>الجمهور المستهدف</span><b>${esc(x["الجمهور المستهدف"])}</b></div></div><div class="detail-body">${Object.entries(x).filter(([k,v])=>v!==""&&v!==null&&v!==undefined&&!["curated_2051","tafra_all_3936"].includes(k)).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join("")}</div>
<div style="margin-top:14px; text-align:center;">
  <button type="button" class="btn btn-primary" onclick="window.openTeleprompter && window.openTeleprompter('${esc(x["اسم الفكرة"])}', '${esc((x["الهوك (أول 3 ثواني)"] || "") + "\n\n" + (x["بنية السكريبت"] || "") + "\n\n" + (x["الـ CTA"] || ""))}')" style="background:linear-gradient(135deg,#0284c7,#06b6d4); border:0; padding:10px 22px; font-weight:800;">
    🎙️ تشغيل ملقن الكاميرا (Teleprompter Mode)
  </button>
</div>
<div class="detail-actions"><span class="pill">${x.curated_2051?"ضمن القائمة المنتقاة":""}</span><span class="pill">${x.tafra_all_3936?"ضمن بنك TAFRA 3,936":""}</span></div></div>`;
 $("#bankDetail").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function exportFilteredBank(){
 const rows=currentBank();if(!rows.length){toast("لا توجد نتائج للتصدير");return;}
 const keys=Object.keys(rows[0]).filter(k=>!["curated_2051","tafra_all_3936"].includes(k));
 const csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\r\n");
 downloadBlob("\ufeff"+csv,"TAFRA_Filtered_Idea_Bank.csv","text/csv;charset=utf-8");toast("تم تصدير "+rows.length+" فكرة");
}
function renderSheetCards(sheetName,title){
 const sd=D.sheets[sheetName];if(!sd){$("#tafraContent").innerHTML=`<div class="empty-state">بيانات الورقة غير متاحة.</div>`;return;}
 const rows=sd.records||[], headers=sd.headers||Object.keys(rows[0]||{});
 $("#tafraContent").innerHTML=`<div class="data-toolbar"><input class="field" id="sheetSearch" placeholder="ابحث داخل ${esc(title)}..."><span class="pill">${rows.length} سجل مستورد</span></div><div class="idea-grid" id="sheetCardGrid"></div><div class="pagination" id="sheetPagination"></div>`;
 $("#sheetSearch").value=sheetSearch;$("#sheetSearch").oninput=()=>{sheetSearch=$("#sheetSearch").value.toLowerCase();sheetPage=1;draw();};
 const draw=()=>{
  const list=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(sheetSearch));
  const pages=Math.max(1,Math.ceil(list.length/24));sheetPage=Math.min(sheetPage,pages);
  const slice=list.slice((sheetPage-1)*24,sheetPage*24);
  $("#sheetCardGrid").innerHTML=slice.map((r,i)=>{
    const vals=headers.filter(h=>r[h]!==""&&r[h]!==null&&r[h]!==undefined).map(h=>[h,r[h]]);
    const titleVal=r["الفكرة / العنوان"]||r["الفكرة"]||r["اسم الفكرة"]||r["اسم الحملة"]||r["العنوان"]||r["الأسبوع"]&&"الأسبوع "+r["الأسبوع"]||r["اليوم"]&&"اليوم "+r["اليوم"]||Object.values(r)[0];
    const hook=r["Hook"]||r["الهوك"]||r["الهوك (أول 3 ثواني)"]||r["الهدف"]||r["المحتوى"]||"";
    return `<article class="idea-row"><div class="card-meta"><span>${esc(r["#"]||r["ID"]||r["الأسبوع"]||r["اليوم"]||`${(bankPage-1)*24+i+1}`)}</span><span>${esc(r["الفورمات"]||r["نوع المحتوى"]||r["المنصة"]||"")}</span></div><h4>${esc(titleVal)}</h4><p>${esc(hook||vals.slice(1,4).map(x=>x[1]).join(" · "))}</p><button class="text-link" data-rowdetail="${(sheetPage-1)*24+i}">عرض تفاصيل الصف ↗</button></article>`;
  }).join("")||`<div class="empty-state">لا توجد نتائج.</div>`;
  $("#sheetPagination").innerHTML=`<button id="sprev" ${sheetPage<=1?"disabled":""}>السابق</button><span>${list.length} سجل · صفحة ${sheetPage}/${pages}</span><button id="snext" ${sheetPage>=pages?"disabled":""}>التالي</button>`;
  $("#sprev")?.addEventListener("click",()=>{sheetPage--;draw();});$("#snext")?.addEventListener("click",()=>{sheetPage++;draw();});
  $$("[data-rowdetail]").forEach(b=>b.onclick=()=>{const r=slice[Number(b.dataset.rowdetail)%24];showSheetRecord(r,title);});
 };
 function showSheetRecord(r,t){
  const detail=Object.entries(r).filter(([,v])=>v!==""&&v!==null&&v!==undefined).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join("");
  $("#sheetDetail")?.remove();
  const d=document.createElement("div");d.id="sheetDetail";d.className="detail-panel";d.innerHTML=`<h2>${esc(t)} · تفاصيل الصف</h2><div class="detail-body">${detail}</div>`;
  $("#tafraContent").appendChild(d);d.scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 draw();
}
function renderAllSheets(){
 const meta=D.sheet_meta||[];
 $("#tafraContent").innerHTML=`<div class="data-toolbar"><input class="field" id="allSheetSearch" placeholder="ابحث عن ورقة عمل..."><span class="pill">${meta.length} ورقة في ملف Excel</span></div><div class="sheet-library" id="sheetLibrary"></div><div id="sheetExplorer" class="page-spacer"></div>`;
 const draw=()=>{
  const q=$("#allSheetSearch").value.toLowerCase();
  $("#sheetLibrary").innerHTML=meta.filter(s=>s.name.toLowerCase().includes(q)).map(s=>`<button class="sheet-card" data-sheet="${esc(s.name)}"><b>${esc(s.name)}</b><span>${s.rows} سجل · ${s.columns||28} عمود</span>${s.storage==="derived_view"?`<em>عرض فرعي — لا تُكرر البيانات</em>`:""}</button>`).join("");
  $$("[data-sheet]").forEach(b=>b.onclick=()=>{activeSheet=b.dataset.sheet;renderOneSheet(activeSheet);});
 };
 $("#allSheetSearch").oninput=draw;draw();
}
function renderOneSheet(name){
 const meta=D.sheet_meta.find(s=>s.name===name), sourceName=(name==="13_بنك_TAFRA_2051"||name==="14_بنك_كل_TAFRA")?"16_المصدر_4175_كامل":name;
 let sd=D.sheets[sourceName];if(!sd)return;
 let rows=sd.records;
 if(name==="13_بنك_TAFRA_2051") rows=rows.filter(r=>r.curated_2051);
 if(name==="14_بنك_كل_TAFRA") rows=rows.filter(r=>r.tafra_all_3936);
 const head=sd.headers||Object.keys(rows[0]||{});
 $("#sheetExplorer").innerHTML=`<div class="panel"><div class="panel-head"><div><span class="panel-kicker">WORKBOOK SHEET</span><h3>${esc(name)}</h3></div><span class="pill">${rows.length.toLocaleString("en")} سجل</span></div><div class="data-toolbar"><input class="field" id="oneSheetSearch" placeholder="ابحث في هذه الورقة..."><button class="btn btn-secondary" id="sheetBack">كل الأوراق</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr>${head.slice(0,10).map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody id="oneSheetRows"></tbody></table></div><div class="pagination" id="oneSheetPag"></div><div class="disclaimer">${meta?.note?esc(meta.note):"البيانات مستوردة من ملف Excel الأصلي دون تعديل في المصدر."}</div></div>`;
 let pg=1,q="";
 const draw=()=>{
   const filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
   const pages=Math.max(1,Math.ceil(filtered.length/40));pg=Math.min(pg,pages);
   const slice=filtered.slice((pg-1)*40,pg*40);
   $("#oneSheetRows").innerHTML=slice.map(r=>`<tr>${head.slice(0,10).map(h=>`<td>${esc(r[h])}</td>`).join("")}</tr>`).join("");
   $("#oneSheetPag").innerHTML=`<button id="onePrev" ${pg<=1?"disabled":""}>السابق</button><span>${filtered.length} نتيجة · ${pg}/${pages}</span><button id="oneNext" ${pg>=pages?"disabled":""}>التالي</button>`;
   $("#onePrev")?.addEventListener("click",()=>{pg--;draw();});$("#oneNext")?.addEventListener("click",()=>{pg++;draw();});
 };
 $("#oneSheetSearch").oninput=()=>{q=$("#oneSheetSearch").value.toLowerCase();pg=1;draw();};
 $("#sheetBack").onclick=renderAllSheets;draw();
}
function renderAnalytics(){
 const targets=D.sheets["18_KPI_12_أسبوع"]?.records||[];
 const metrics=["Reach","Followers","Leads","Saves","Shares","Completion Rate"];
 const values=state.actualMetrics||{};
 $("#tafraContent").innerHTML=`<div class="analytics-grid"><div class="chart-panel"><div class="panel-head"><div><span class="panel-kicker">PLANNED TARGETS</span><h3>أهداف القياس المسجلة</h3></div><span class="pill warn">مخططة وليست نتائج</span></div>${targets.slice(0,8).map((r,i)=>`<div class="bar-line"><span>${esc(r["المؤشر"]||r["KPI"]||r["الأسبوع"]||`Target ${i+1}`)}</span><div class="bar-track"><i style="width:${Math.min(100,12+i*8)}%"></i></div><b>${esc(Object.values(r).slice(1,3).join(" / "))}</b></div>`).join("")}<p class="muted-text">الشريط هنا فهرسة بصرية للصفوف، وليس قياسًا فعليًا أو نسبة تحقيق.</p></div><div class="chart-panel"><div class="panel-head"><div><span class="panel-kicker">ACTUAL DATA INPUT</span><h3>أدخل النتائج الفعلية</h3></div><span class="pill">محلي</span></div><form id="actualForm">${metrics.map(m=>`<div class="metric-input-row"><label>${m}<input class="field" name="${m}" type="number" min="0" step="any" value="${esc(values[m]??"")}" placeholder="أدخل الرقم الفعلي"></label></div>`).join("")}<button class="btn btn-primary">حفظ النتائج</button></form><div id="actualChart"></div></div></div>`;
 $("#actualForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);metrics.forEach(m=>state.actualMetrics[m]=fd.get(m)===""?"":Number(fd.get(m)));persist();renderAnalytics();toast("تم حفظ مؤشراتك الفعلية محليًا");};
}

function renderBetafra(){
 const tabs=$$('.tab-row[data-tabs="betafra"] .tab');tabs.forEach(x=>x.classList.toggle("active",x.dataset.tab===betafraTab));
 const host=$("#betafraContent");
 if(betafraTab==="student"){
  const stages=[
   ["01","افهم التحدي","اختر ما تواجهه الآن: تشتت الأهداف، التسويف، ضغط الدراسة، التشتت الرقمي، أو صعوبة الاستمرار."],
   ["02","اختر مسارًا قصيرًا","تصفح المحتوى والأدوات المناسبة دون استبيان طويل أو إجبار على مشاركة بيانات حساسة."],
   ["03","استخدم أداة واحدة","جرّب أداة عملية مرتبطة بهدفك الحالي، وسجّل ما خرجت به."],
   ["04","أنجز فعلًا واضحًا","حوّل الفهم إلى مخرج صغير يمكن ملاحظته في الدراسة أو العمل."],
   ["05","راجع واستمر","راجع التقدم على جهازك، واختر الخطوة التالية دون وعود بنتائج مضمونة."]
  ];
  host.innerHTML=`<div class="betafra-grid">${stages.map(x=>`<article class="journey-stage-card"><span class="stage-no">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join("")}</div><div class="disclaimer">رحلة تعليمية اختيارية وليست تقييمًا طبيًا أو نفسيًا، ولا ينبغي استخدامها لتشخيص اضطراب أو تأخير طلب مساعدة مختصة.</div>`;
 } else if(betafraTab==="institution"){
  host.innerHTML=`<div class="institution-layout"><div class="highlight-box"><span class="panel-kicker">INSTITUTIONAL VALUE</span><h3>برنامج عملي لتنمية مهارات التركيز والتعلم وإدارة العمل لدى الطلاب.</h3><p>يجمع FOCUS LAB بين محتوى تعليمي مبني على مراجع، وأدوات عملية، ورحلة منظمة، ومراجعة نتائج قابلة للتقييم. يقدَّم بوصفه برنامجًا تعليميًا لا خدمة تشخيص أو علاج.</p><div class="hero-actions"><button class="btn btn-primary" id="downloadBrief">تحميل موجز البرنامج</button><button class="btn btn-ghost" data-go="learn">مراجعة الأدلة</button></div></div><div class="panel"><span class="panel-kicker">UNIVERSITY JOURNEY</span><h3>ماذا تحتاج الجهة أن تعرف؟</h3><ol class="plain-list"><li>المشكلة الطلابية التي يعالجها البرنامج تعليميًا.</li><li>ما الذي سينفذه الطالب بالفعل.</li><li>كيف تُدار المشاركة والخصوصية.</li><li>ما مؤشرات التقييم المقترحة وكيف تُفسر.</li><li>موارد التنفيذ والجدول والمسؤوليات.</li><li>آلية مراجعة التجربة والتعديل.</li></ol><div class="disclaimer">لا توجد شراكة جامعية مؤكدة أو موافقة مؤسسية مسجلة في هذه النسخة؛ هذا مسار عرض ومقترح Pilot فقط.</div></div></div>`;
  $("#downloadBrief").onclick=()=>downloadBlob("BE TAFRA — موجز تعريفي\n\nFOCUS LAB برنامج تعليمي عملي لتنمية التركيز والتعلم وإدارة العمل لدى الطلاب.\n\nالمكونات: FOCUS LEARN + FOCUS TOOLS + FOCUS JOURNEY.\n\nالتنفيذ المقترح: تجربة محدودة، قياس قبلي/بعدي مناسب، ومراجعة للخصوصية وإتاحة الاستخدام. لا توجد شراكة مؤكدة أو نتائج ميدانية معتمدة ضمن هذه الحزمة.","BE_TAFRA_Brief_AR.txt","text/plain;charset=utf-8");
 } else if(betafraTab==="pilot"){
  host.innerHTML=`<div class="grid2"><div class="panel"><span class="panel-kicker">PROPOSED PILOT / NOT YET APPROVED</span><h3>مسار تجريبي مقترح</h3><div class="timeline"><div class="item"><b>تحديد النطاق</b><p>الجمهور، المدة، موضوعات البرنامج، ومخرجات التعلم.</p></div><div class="item"><b>المراجعة المؤسسية</b><p>الخصوصية، الإتاحة، المحتوى، وحدود الاستخدام.</p></div><div class="item"><b>تشغيل محدود</b><p>مجموعة صغيرة ومدة محددة، مع موافقة الجهة وإبلاغ المشاركين.</p></div><div class="item"><b>التقييم</b><p>مؤشرات استخدام وتعلم وتجربة مستخدم، دون ادعاءات سببية بلا تصميم مناسب.</p></div><div class="item"><b>قرار الاستمرار</b><p>اعتماد أو تعديل أو إيقاف بناءً على البيانات والموارد.</p></div></div></div><div class="panel"><span class="panel-kicker">PILOT BRIEF BUILDER</span><h3>محددات التجربة</h3><form id="pilotForm" class="stack-form"><label>الفئة المستهدفة<input class="field" name="audience" placeholder="مثال: طلاب السنة الأولى"></label><label>المدة المقترحة<select class="field" name="duration"><option>4 أسابيع</option><option>6 أسابيع</option><option>8 أسابيع</option><option>12 أسبوعًا</option></select></label><label>المشكلة التعليمية<textarea class="field" name="problem" rows="2"></textarea></label><label>مخرجات التعلم<textarea class="field" name="outcomes" rows="2"></textarea></label><button class="btn btn-primary">إنشاء مسودة Pilot</button></form><div id="pilotOutput"></div></div></div>`;
  $("#pilotForm").onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));$("#pilotOutput").innerHTML=box(`<h4>مسودة غير معتمدة</h4>الجمهور: ${esc(v.audience)}\nالمدة: ${esc(v.duration)}\nالمشكلة: ${esc(v.problem)}\nالمخرجات: ${esc(v.outcomes)}\n\nيلزم تحديد مسؤول الجهة، وموافقة الخصوصية، ومقياس التقييم قبل التنفيذ.`);};
 } else if(betafraTab==="safeguards"){
  host.innerHTML=`<div class="grid2">${[
   ["الخصوصية","لا يُطلب حساب. بيانات الطالب الخاصة تبقى محليًا في النسخة الحالية ولا تُرسل إلى جهة."],
   ["تقليل البيانات","لا تجمع معلومات صحية أو حساسة بلا ضرورة وموافقة مناسبة. لا تستخدم أدوات التركيز للتشخيص."],
   ["الإتاحة","دعم لوحة المفاتيح، أحجام شاشة مختلفة، لغة واضحة، وتقليل الحركة عند تفضيل المستخدم."],
   ["الأدلة","اعرض نوع المصدر وحدوده، وميّز الارتباط عن السببية والرأي عن النتيجة البحثية."],
   ["القياس","افصل الاستخدام والرضا والإنجاز عن أي ادعاء تحسن سببي. يلزم تصميم تقييم مناسب."],
   ["المسؤولية","يجب مراجعة المحتوى والخصوصية والنطاق المؤسسي قبل أي إطلاق رسمي."]
  ].map(x=>`<div class="journey-stage-card"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join("")}</div>`;
 }
}
function renderResearch(){
 const counts=[
  [D.arabic_books.length,"مدخل عربي/إسلامي"],
  [D.western_works.length,"عمل غربي"],
  [D.people.length,"شخصية"],
  [D.research_cards.length,"بطاقة بحثية"]
 ];
 $("#researchDashboard").innerHTML=counts.map(x=>`<div class="research-card-mini"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
 const rows=D.arabic_books.map(b=>{
   const [label,cl]=statusView(b.status);
   return `<div class="research-log-row"><div class="research-log-no">${String(b.sequence).padStart(2,"0")}</div><div><b>${esc(b.title)}</b><small>${esc(label)}${b.note?" · "+esc(b.note):""}</small></div><span class="pill ${cl}">${b.sequence===2?"ملف سابق":b.status==="blocked_attribution"?"تحقق":"في قائمة الانتظار"}</span></div>`;
 }).join("");
 $("#researchLog").innerHTML=rows+`<div class="callout"><strong>تصحيح ترتيب:</strong> وفق المكتبة الموحدة، «الفصل بين النفس والعقل» هو المدخل الأول لكنه معلّق نسبةً وطبعةً؛ «ذم الهوى» هو الثاني وله دراسة مستقلة جزئية؛ وبالتالي المحطة التالية المتاحة بعد حسم المدخل الأول هي «صيد الخاطر»، لا «إغاثة اللهفان» مباشرة.</div>`;
 $("#researchNotes").innerHTML=state.researchNotes.slice(0,12).map(n=>`<div class="history-item"><b>${esc(n.title)}</b> <span class="pill">${esc(n.type)}</span><br>${esc(n.body)}<br><small>${new Date(n.at).toLocaleString("ar-EG")}</small></div>`).join("")||`<div class="empty-state">لم تُضف ملاحظات بعد.</div>`;
}
function decodeCorpus(doc){
 if(archiveCache[doc.id])return archiveCache[doc.id];
 const bytes=Uint8Array.from(atob(doc.base64),c=>c.charCodeAt(0));
 const text=new TextDecoder("utf-8").decode(bytes);
 archiveCache[doc.id]=text;return text;
}
function renderArchive(){
 $("#archiveDocs").innerHTML=CORPUS.map(d=>`<button class="archive-doc-button ${d.id===selectedArchive?"active":""}" data-archive="${d.id}">${esc(d.title)}<small>${esc(d.description)} · ${(d.size/1024).toFixed(0)} KB</small></button>`).join("");
 $$("[data-archive]").forEach(b=>b.onclick=()=>{selectedArchive=b.dataset.archive;renderArchive();});
 const doc=CORPUS.find(x=>x.id===selectedArchive)||CORPUS[0];if(!doc)return;
 const content=decodeCorpus(doc);
 $("#archiveTitle").textContent=doc.title;
 $("#archiveSearch").value="";
 showArchiveText(content,"");
 $("#archiveSearch").oninput=()=>showArchiveText(content,$("#archiveSearch").value.trim());
}
function showArchiveText(content,q){
 const host=$("#archiveResult");
 if(!q){host.textContent=content.slice(0,15000)+"\n\n[المعاينة تعرض أول 15,000 حرف فقط. استخدم البحث لاسترجاع مقاطع موضعية، أو افتح الملف الكامل من مجلد source_archive داخل الحزمة.]";return;}
 const low=content.toLowerCase(),term=q.toLowerCase(),snips=[];let pos=0;
 while((pos=low.indexOf(term,pos))>=0&&snips.length<35){
   const s=Math.max(0,pos-280),e=Math.min(content.length,pos+q.length+500);
   snips.push(content.slice(s,e).replace(/\n{3,}/g,"\n\n"));pos+=term.length||1;
 }
 if(!snips.length){host.textContent="لا توجد مطابقة داخل هذا المستند.";}
 else host.textContent=`${snips.length} مقطع مطابق:\n\n`+snips.join("\n\n────────────────────\n\n");
}
function addTask(v){
 state.tasks.unshift({id:Date.now(),title:v.title,stage:v.stage,priority:v.priority,due:v.due,next:v.next,done:false,createdAt:nowISO()});
 persist();renderMastery();toast("تمت إضافة المهمة");
}
function downloadBlob(content,name,type="application/octet-stream"){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function exportUserData(){
 const payload={product:"FOCUS LAB × TAFRA OS",version:1,exportedAt:nowISO(),state};
 downloadBlob(JSON.stringify(payload,null,2),"FOCUS_TAFRA_User_Data_Backup.json","application/json");$("#dataStatus").textContent="تم إنشاء نسخة احتياطية من بياناتك المحلية.";
}
function importUserData(file){
 const reader=new FileReader();reader.onload=()=>{
  try{
   const payload=JSON.parse(reader.result);if(!payload.state||!payload.product?.includes("FOCUS LAB"))throw new Error("invalid");
   state={...defaultState(),...payload.state};persist();renderAllCurrent();$("#dataStatus").textContent="تم استيراد بياناتك وحفظها محليًا.";toast("اكتمل الاستيراد");
  }catch(e){$("#dataStatus").textContent="ملف النسخة الاحتياطية غير صالح أو لا يتبع هذا المنتج.";}
 };reader.readAsText(file);
}
function resetUserData(){
 if(!confirm("هل تريد مسح المهام والتقدم والملاحظات المحلية؟ لن تُحذف ملفات المصادر."))return;
 state=defaultState();persist();renderAllCurrent();toast("تم مسح بياناتك المحلية");
}
function renderAllCurrent(){
 updateOverview();
 if(activePage==="journey")renderJourney();
 if(activePage==="mastery")renderMastery();
 if(activePage==="research")renderResearch();
 if(activePage==="tafra")renderTafra();
}
function executeGlobalSearch(q){
 q=q.trim().toLowerCase();if(!q)return;
 const matches=[];
 D.arabic_books.forEach(x=>{if(`${x.title} ${x.body}`.toLowerCase().includes(q))matches.push({type:"arabicBooks",page:"learn",title:x.title,detail:"المكتبة العربية",id:x.sequence});});
 D.western_works.forEach(x=>{if(`${x.title} ${x.body}`.toLowerCase().includes(q))matches.push({type:"westernWorks",page:"learn",title:x.title,detail:"الأعمال الغربية",id:x.sequence});});
 D.people.forEach(x=>{if(`${x.title} ${x.body}`.toLowerCase().includes(q))matches.push({type:"people",page:"learn",title:x.title,detail:"الشخصيات",id:x.sequence});});
 D.research_cards.forEach(x=>{if(`${x.source_title} ${x.finding} ${x.limit}`.toLowerCase().includes(q))matches.push({type:"researchCards",page:"learn",title:x.source_title,detail:"بطاقة بحثية",id:x.id});});
 D.ideas.forEach(x=>{if(`${x.title} ${x.detail} ${x.try}`.toLowerCase().includes(q))matches.push({type:"ideas",page:"learn",title:x.title,detail:"فكرة بحثية",id:x.id});});
 (D.content_bank||[]).forEach(x=>{if(matches.length<35&&`${x["اسم الفكرة"]} ${x["الهوك (أول 3 ثواني)"]} ${x["النيش الرئيسي"]}`.toLowerCase().includes(q))matches.push({type:"bank",page:"tafra",title:x["اسم الفكرة"],detail:"بنك أفكار TAFRA",id:x["ID"]});});
 return matches.slice(0,30);
}
function showSearchResults(q){
 const results=executeGlobalSearch(q)||[];
 $("#commandInput").value=q;
 $("#commandResults").innerHTML=results.map((r,i)=>`<button class="command-result" data-search-result="${i}"><b>${esc(r.title)}</b><small style="display:block;color:#91a098">${esc(r.detail)}</small></button>`).join("")||`<div class="empty-state">لا توجد نتائج.</div>`;
 $$("#commandResults [data-search-result]").forEach(b=>b.onclick=()=>{
   const r=results[Number(b.dataset.searchResult)];
   if(r.page==="learn"){learnTab=r.type;openPage("learn");if(r.type==="arabicBooks")showBook(Number(r.id));else{setTimeout(()=>{if(r.type==="researchCards"){const el=$("#researchCardSearch");if(el){el.value=q;el.dispatchEvent(new Event("input"));}}},60);}}
   if(r.page==="tafra"){tafraTab="bank";openPage("tafra");setTimeout(()=>{$("#bankSearch").value=q;$("#bankSearch").dispatchEvent(new Event("input"));},80);}
   $("#commandPalette").classList.remove("open");
 });
 $("#commandPalette").classList.add("open");
}
function openCommand(){showSearchResults("");$("#commandPalette").classList.add("open");$("#commandInput").focus();}

function bindEvents(){
  document.addEventListener("click",e=>{const c=e.target.closest(".copy-tool-output");if(c){const box=c.closest(".result-box");const clone=box.cloneNode(true);clone.querySelectorAll("button").forEach(b=>b.remove());copyText(clone.innerText.trim());}});
  $$(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.page)));
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.go)));
  $$('[data-tabs="learn"] .tab').forEach(b=>b.addEventListener("click",()=>{learnTab=b.dataset.tab;selectedBook=null;renderLearn();}));
  $$('[data-tabs="tafra"] .tab').forEach(b=>b.addEventListener("click",()=>{tafraTab=b.dataset.tab;sheetSearch="";bankSearch="";renderTafra();}));
  $$('[data-tabs="betafra"] .tab').forEach(b=>b.addEventListener("click",()=>{betafraTab=b.dataset.tab;renderBetafra();}));
  const ts=$("#toolSearch"), tg=$("#toolGroup");
  if(ts) ts.addEventListener("input",renderTools);
  if(tg) tg.addEventListener("change",renderTools);
  const cm1=$("#closeModal"), cm2=$("#closeModal2"), tm=$("#toolModal");
  if(cm1) cm1.onclick=closeTool;
  if(cm2) cm2.onclick=closeTool;
  if(tm) tm.addEventListener("click",e=>{if(e.target.id==="toolModal")closeTool();});
  const mob=$("#mobileMenuBtn")||$("#mobileMenu");
  if(mob) mob.onclick=()=>{const sb=$("#sidebar");if(sb)sb.classList.toggle("open");};
  const qa=$("#quickAdd");
  if(qa) qa.onclick=()=>{openPage("mastery");setTimeout(()=>$("#taskForm input[name=title]")?.focus(),80);};
  const ntb=$("#newTaskBtn");
  if(ntb) ntb.onclick=()=>$("#taskForm input[name=title]")?.focus();
  const tf=$("#taskForm");
  if(tf) tf.onsubmit=e=>{e.preventDefault();addTask(Object.fromEntries(new FormData(e.currentTarget)));e.currentTarget.reset();};
  $$("[data-taskfilter]").forEach(b=>b.onclick=()=>{taskFilter=b.dataset.taskfilter;$$("[data-taskfilter]").forEach(x=>x.classList.toggle("active",x===b));renderMastery();});
  const wf=$("#weeklyForm");
  if(wf) wf.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));state.weeklyReviews.unshift({...v,id:Date.now(),at:nowISO()});state.weeklyReviews=state.weeklyReviews.slice(0,30);persist();e.currentTarget.reset();renderMastery();toast("تم حفظ المراجعة الأسبوعية");};
  const js=$("#journeyStart");
  if(js) js.onchange=()=>{state.journey.startDate=js.value;persist();renderJourney();};
  const rnf=$("#researchNoteForm");
  if(rnf) rnf.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));state.researchNotes.unshift({...v,id:Date.now(),at:nowISO()});state.researchNotes=state.researchNotes.slice(0,200);persist();e.currentTarget.reset();renderResearch();toast("حُفظت الملاحظة البحثية");};
  const exp=$("#exportData"), imp=$("#importData"), rst=$("#resetData");
  if(exp) exp.onclick=exportUserData;
  if(imp) imp.onchange=e=>{const file=e.target.files?.[0];if(file)importUserData(file);e.target.value="";};
  if(rst) rst.onclick=resetUserData;
  const gs=$("#globalSearch");
  if(gs){
    gs.addEventListener("keydown",e=>{if(e.key==="Enter")showSearchResults(e.target.value);});
    gs.addEventListener("focus",()=>{if(window.innerWidth<800){}});
  }
  const ci=$("#commandInput"), cp=$("#commandPalette");
  if(ci){
    ci.addEventListener("input",e=>showSearchResults(e.target.value));
    ci.addEventListener("keydown",e=>{if(e.key==="Escape"&&cp)cp.classList.remove("open");if(e.key==="Enter")$("#commandResults button")?.click();});
  }
  if(cp) cp.addEventListener("click",e=>{if(e.target.id==="commandPalette")cp.classList.remove("open");});
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommand();}
    if(e.key==="Escape"){closeTool();const pal=$("#commandPalette");if(pal)pal.classList.remove("open");}
  });
}
function init(){
  bindEvents();
  selectedJourneyDay=state.journey.selectedDay||1;
  updateOverview();
  renderLearn();renderTools();renderJourney();renderMastery();renderTafra();renderBetafra();renderResearch();
  if(location.hash){const name=location.hash.replace("#","");if($("#page-"+name))openPage(name);}
  window.APP = {
    openPage, toast, getState: () => state, persist, openTool, updateOverview, D, CORPUS
  };
  console.info("FOCUS LAB × TAFRA OS ready",{
    sheets:D.meta.verified_counts.workbook_sheets,
    ideaBank:D.content_bank.length,tools:D.tools.length,journey:D.journey.length,
    researchCards:D.research_cards.length
  });
}
document.addEventListener("DOMContentLoaded",init);
})();

// Delegated navigation also covers buttons created inside the student/institution views.
document.addEventListener("click", e=>{
  const go=e.target.closest("[data-go]");
  if(go){openPage(go.dataset.go);}
});
