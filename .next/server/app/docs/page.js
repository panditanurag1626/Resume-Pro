(()=>{var e={};e.id=726,e.ids=[726],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8530:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>o,pages:()=>h,routeModule:()=>j,tree:()=>c}),r(6819),r(1506),r(6560);var t=r(3191),l=r(8716),i=r(7922),n=r.n(i),a=r(5231),d={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>a[e]);r.d(s,d);let c=["",{children:["docs",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,6819)),"D:\\Resume-Pro\\app\\docs\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,1506)),"D:\\Resume-Pro\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,6560)),"D:\\Resume-Pro\\app\\not-found.tsx"]}],h=["D:\\Resume-Pro\\app\\docs\\page.tsx"],o="/docs/page",x={require:r,loadChunk:()=>Promise.resolve()},j=new t.AppPageRouteModule({definition:{kind:l.x.APP_PAGE,page:"/docs/page",pathname:"/docs",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},3176:(e,s,r)=>{Promise.resolve().then(r.bind(r,7377)),Promise.resolve().then(r.t.bind(r,9404,23))},1611:(e,s,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},4738:(e,s,r)=>{Promise.resolve().then(r.t.bind(r,9404,23))},2926:()=>{},7377:(e,s,r)=>{"use strict";r.d(s,{Header:()=>m,default:()=>p});var t=r(326),l=r(434),i=r(5047),n=r(7577),a=r(4019),d=r(748),c=r(1135),h=r(1009);function o(...e){return(0,h.m6)((0,c.W)(e))}let x=[{href:"/templates",label:"Templates"},{href:"/builder",label:"Builder"},{href:"/ats",label:"ATS Score"},{href:"/dashboard",label:"My Resumes"},{href:"/docs",label:"API Docs"}];function j(){return(0,t.jsxs)(l.default,{href:"/",className:"flex items-center gap-2",children:[t.jsx("span",{className:"flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm",children:"R"}),t.jsx("span",{className:"text-base font-semibold text-slate-900",children:"ResumeUp.AI"})]})}function m(){let e=(0,i.usePathname)(),[s,r]=(0,n.useState)(!1),c=s=>"/"===s?"/"===e:e?.startsWith(s);return(0,t.jsxs)("header",{className:"sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",children:[(0,t.jsxs)("div",{className:"mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",children:[(0,t.jsxs)("div",{className:"flex items-center gap-8",children:[t.jsx(j,{}),t.jsx("nav",{className:"hidden md:flex items-center gap-6",children:x.map(e=>t.jsx(l.default,{href:e.href,className:o("text-sm font-medium transition-colors",c(e.href)?"text-brand-700":"text-slate-600 hover:text-slate-900"),children:e.label},e.href))})]}),t.jsx("div",{className:"hidden md:flex items-center gap-3",children:t.jsx(l.default,{href:"/builder",className:"inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700",children:"Create resume"})}),t.jsx("button",{type:"button",className:"md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100",onClick:()=>r(e=>!e),"aria-label":s?"Close menu":"Open menu",children:s?t.jsx(a.Z,{className:"h-5 w-5"}):t.jsx(d.Z,{className:"h-5 w-5"})})]}),t.jsx("div",{className:o("md:hidden overflow-hidden border-t border-slate-200/70 bg-white transition-[max-height] duration-200",s?"max-h-96":"max-h-0"),children:(0,t.jsxs)("nav",{className:"flex flex-col gap-1 px-4 py-3",children:[x.map(e=>t.jsx(l.default,{href:e.href,className:o("rounded-md px-3 py-2 text-sm font-medium",c(e.href)?"bg-brand-50 text-brand-700":"text-slate-700 hover:bg-slate-50"),onClick:()=>r(!1),children:e.label},e.href)),t.jsx(l.default,{href:"/builder",onClick:()=>r(!1),className:"mt-2 rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-700",children:"Create resume"})]})})]})}let p=m},6819:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>v,metadata:()=>a});var t=r(9510),l=r(664),i=r(9167),n=r(4822);let a={title:"API Docs — Resume Builder",description:"REST API reference for the Resume Builder: parse PDFs, render 62 templates, ATS-score resumes via JSON Resume schema. No signup required."};function d({method:e}){let s="GET"===e?"bg-green-500":"POST"===e?"bg-brand-600":"PUT"===e?"bg-amber-500":"bg-red-500";return t.jsx("span",{className:`inline-block ${s} text-white text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5`,children:e})}function c({method:e,path:s}){return(0,t.jsxs)("div",{className:"my-3 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm",children:[t.jsx(d,{method:e}),t.jsx("span",{className:"break-all font-mono font-medium text-slate-900",children:s})]})}function h({children:e}){return t.jsx("span",{className:"inline-flex items-center bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full",children:e})}function o({children:e}){return t.jsx("code",{className:"rounded border border-slate-200/70 bg-slate-100 px-1.5 py-[1px] font-mono text-[12.5px] font-medium text-brand-700",children:e})}function x({children:e,language:s}){return(0,t.jsxs)("div",{className:"my-4 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1020] shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[t.jsx("span",{className:"h-2.5 w-2.5 rounded-full bg-red-500/70"}),t.jsx("span",{className:"h-2.5 w-2.5 rounded-full bg-amber-500/70"}),t.jsx("span",{className:"h-2.5 w-2.5 rounded-full bg-emerald-500/70"})]}),s?t.jsx("span",{className:"font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400",children:s}):null]}),t.jsx("pre",{className:"overflow-x-auto whitespace-pre p-4 font-mono text-[13px] leading-[1.6] text-slate-100",children:e})]})}function j({id:e,children:s}){return t.jsx("h2",{id:e,className:"text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 mt-12 scroll-mt-20",children:s})}function m({children:e}){return t.jsx("h3",{className:"text-lg font-semibold text-slate-900 mt-6 mb-3",children:e})}function p({children:e}){return t.jsx("h4",{className:"text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-5 mb-1",children:e})}function u({variant:e="brand",title:s,children:r}){return(0,t.jsxs)("div",{className:`border-l-4 ${"warn"===e?"border-amber-500 bg-amber-50":"danger"===e?"border-red-500 bg-red-50":"success"===e?"border-green-500 bg-green-50":"border-brand-500 bg-brand-50"} px-4 py-3 rounded-r my-4 text-sm text-slate-700`,children:[s?t.jsx("strong",{className:"block mb-1 text-slate-900",children:s}):null,r]})}function f({num:e,title:s,children:r}){return(0,t.jsxs)("div",{className:"flex gap-4 my-5",children:[t.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center",children:e}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[t.jsx("h4",{className:"font-semibold text-slate-900 mb-1",children:s}),r]})]})}function b({children:e}){return t.jsx("th",{className:"bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600",children:e})}function g({children:e}){return t.jsx("td",{className:"px-3 py-2 border-t border-slate-100 text-[13px] text-slate-700 align-top",children:e})}function y({children:e}){return t.jsx("div",{className:"overflow-x-auto my-4",children:t.jsx("table",{className:"w-full text-sm border border-slate-200 rounded-lg overflow-hidden",children:e})})}let w=[{group:"Getting Started",items:[{id:"intro",label:"Introduction"},{id:"quick-start",label:"Quick Start"}]},{group:"Resume API",items:[{id:"upload",label:"Upload Resume"},{id:"get-resume",label:"Get Parsed Resume"},{id:"jsonresume",label:"Get as JSON Resume"},{id:"response-schema",label:"Response Schema"}]},{group:"Templates API",items:[{id:"list-templates",label:"List Templates"},{id:"single-template",label:"Single Template"},{id:"categories",label:"Categories"},{id:"live-preview",label:"Live Preview (form→HTML)"},{id:"render-json",label:"Render (JSON)"},{id:"preview",label:"Preview (GET)"},{id:"available-templates",label:"Available Templates"}]},{group:"ATS API",items:[{id:"ats-analyze",label:"ATS Analyze"},{id:"ai-feedback",label:"AI Feedback"}]},{group:"Reference",items:[{id:"errors",label:"Error Codes"},{id:"client-examples",label:"Client Examples"},{id:"cheatsheet",label:"API Cheatsheet"}]}];function v(){return(0,t.jsxs)(t.Fragment,{children:[t.jsx(l.Z,{}),t.jsx("div",{className:"min-h-screen bg-white",children:(0,t.jsxs)("div",{className:"mx-auto max-w-7xl flex flex-col md:flex-row gap-8 px-4 sm:px-6 py-8",children:[t.jsx("aside",{className:"hidden md:block md:w-60 md:flex-shrink-0",children:t.jsx("nav",{className:"sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2","aria-label":"Docs navigation",children:w.map(e=>(0,t.jsxs)("div",{className:"mb-5",children:[t.jsx("h4",{className:"text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1",children:e.group}),t.jsx("ul",{children:e.items.map(e=>t.jsx("li",{children:t.jsx("a",{href:`#${e.id}`,className:"block px-3 py-1.5 text-sm text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors",children:e.label})},e.id))})]},e.group))})}),(0,t.jsxs)("main",{className:"flex-1 min-w-0 max-w-4xl",children:[(0,t.jsxs)("section",{id:"intro",className:"scroll-mt-20",children:[(0,t.jsxs)("div",{className:"bg-gradient-to-br from-brand-50 to-violet-50 p-10 rounded-2xl border border-brand-100",children:[t.jsx("h1",{className:"text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900",children:"Resume Parser API"}),t.jsx("p",{className:"mt-3 text-slate-700 text-base md:text-lg max-w-2xl",children:"Upload a PDF → get parsed JSON. Render into 62 beautiful templates. AI-powered ATS scoring. No signup required."}),(0,t.jsxs)("div",{className:"mt-6 flex flex-wrap gap-2",children:[t.jsx(h,{children:"Next.js"}),t.jsx(h,{children:"AI-Powered"}),t.jsx(h,{children:"62 Templates"}),t.jsx(h,{children:"CORS Enabled"}),t.jsx(h,{children:"REST API"}),t.jsx(h,{children:"JSON Resume"}),t.jsx(h,{children:"Free"})]})]}),t.jsx("h2",{className:"text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 mt-12 scroll-mt-20",children:"Introduction"}),t.jsx("p",{className:"text-slate-700 leading-relaxed",children:"The Resume Parser API is a Next.js App Router REST service that does four things:"}),(0,t.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 my-4",children:[(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900 mb-1",children:"1. Parse PDFs"}),t.jsx("p",{className:"text-[13px] text-slate-600",children:"Extract structured data from resume PDFs using AI, returning the standard JSON Resume schema."})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900 mb-1",children:"2. Template Gallery"}),t.jsx("p",{className:"text-[13px] text-slate-600",children:"Browse 62 resume templates via a simple JSON API — ideal for a template picker screen."})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900 mb-1",children:"3. HTML Rendering"}),t.jsx("p",{className:"text-[13px] text-slate-600",children:"Render any JSON Resume into any template and get back raw HTML for live preview or PDF export."})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-4",children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900 mb-1",children:"4. ATS Scoring"}),t.jsx("p",{className:"text-[13px] text-slate-600",children:"Rule-based scoring plus AI-generated feedback covering keywords, action verbs, weak areas and more."})]})]}),(0,t.jsxs)("p",{className:"text-slate-700 mt-4",children:[t.jsx("strong",{children:"Base URL:"})," ",t.jsx(o,{children:"http://localhost:3000"})," (or your deployed origin). From the browser, prefer relative paths like"," ",t.jsx(o,{children:"/api/templates"}),"."]}),(0,t.jsxs)("p",{className:"text-slate-700 mt-2",children:[t.jsx("strong",{children:"Schema:"})," Every endpoint that accepts or returns resume data uses the standardized"," ",t.jsx("a",{href:"https://jsonresume.org/schema",className:"text-brand-700 underline hover:text-brand-800",target:"_blank",rel:"noreferrer",children:"JSON Resume"})," ","shape (",t.jsx(o,{children:"basics"}),","," ",t.jsx(o,{children:"work"}),", ",t.jsx(o,{children:"education"}),","," ",t.jsx(o,{children:"skills"}),", etc.)."]})]}),(0,t.jsxs)("section",{id:"quick-start",className:"scroll-mt-20",children:[t.jsx(j,{id:"quick-start-h",children:"Quick Start"}),t.jsx("p",{className:"text-slate-700",children:"The full workflow in 4 API calls:"}),(0,t.jsxs)(f,{num:1,title:"Upload a PDF",children:[t.jsx(c,{method:"POST",path:"/api/upload-resume"}),(0,t.jsxs)("p",{className:"text-[14px] text-slate-700",children:["Send the PDF as ",t.jsx(o,{children:"multipart/form-data"}),". You get back parsed JSON Resume + ATS scores +"," ",t.jsx(o,{children:"upload_id"}),"."]})]}),(0,t.jsxs)(f,{num:2,title:"List available templates",children:[t.jsx(c,{method:"GET",path:"/api/templates"}),t.jsx("p",{className:"text-[14px] text-slate-700",children:"Show thumbnails in a grid and let the user pick one of 62 designs."})]}),(0,t.jsxs)(f,{num:3,title:"Render the chosen template",children:[t.jsx(c,{method:"POST",path:"/api/templates/{id}/html"}),(0,t.jsxs)("p",{className:"text-[14px] text-slate-700",children:["Pipe the parsed JSON (or ",t.jsx(o,{children:"upload_id"}),") back in and stream HTML into an iframe's"," ",t.jsx(o,{children:"srcDoc"}),"."]})]}),(0,t.jsxs)(f,{num:4,title:"Get ATS feedback",children:[t.jsx(c,{method:"POST",path:"/api/ats-analyze"}),t.jsx("p",{className:"text-[14px] text-slate-700",children:"Score the resume with rule-based + AI feedback to drive your ATS UI."})]})]}),(0,t.jsxs)("section",{id:"upload",className:"scroll-mt-20",children:[t.jsx(j,{id:"upload-h",children:"1. Upload Resume"}),t.jsx(c,{method:"POST",path:"/api/upload-resume"}),t.jsx("p",{className:"text-slate-700",children:"Upload a PDF file and get back structured, parsed resume data in JSON Resume format plus ATS scoring."}),t.jsx(m,{children:"Request"}),(0,t.jsxs)("p",{className:"text-slate-700 text-sm",children:[t.jsx("strong",{children:"Content-Type:"})," ",t.jsx(o,{children:"multipart/form-data"})]}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Required"}),t.jsx(b,{children:"Description"})]})}),t.jsx("tbody",{children:(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"file"})}),t.jsx(g,{children:"File"}),t.jsx(g,{children:"Yes"}),t.jsx(g,{children:"PDF resume, max 16 MB"})]})})]}),t.jsx(m,{children:"Code Examples"}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:`curl -X POST \\
  -F "file=@resume.pdf" \\
  http://localhost:3000/api/upload-resume`}),t.jsx(p,{children:"JavaScript (fetch)"}),t.jsx(x,{children:`const form = new FormData();
form.append("file", pdfFile);        // File from <input type="file">

const res = await fetch("/api/upload-resume", {
  method: "POST",
  body: form,
});
const json = await res.json();

// JSON Resume schema response
const uploadId = json.upload_id;
const basics = json.data.basics;
const summary = json.data.basics.summary;
const work = json.data.work;
console.log(basics.name, basics.email);`}),t.jsx(p,{children:"React Native"}),t.jsx(x,{children:`import * as DocumentPicker from "expo-document-picker";

// 1. Pick the PDF
const pick = await DocumentPicker.getDocumentAsync({
  type: "application/pdf",
});
if (pick.canceled) return;
const file = pick.assets[0];

// 2. Upload
const formData = new FormData();
formData.append("file", {
  uri: file.uri,
  name: file.name,
  type: "application/pdf",
});

const res = await fetch("http://192.168.1.10:3000/api/upload-resume", {
  method: "POST",
  body: formData,
  headers: { "Content-Type": "multipart/form-data" },
});
const json = await res.json();
// Save upload_id for later template rendering
await AsyncStorage.setItem("upload_id", String(json.upload_id));`}),t.jsx(p,{children:"Axios"}),t.jsx(x,{children:`import axios from "axios";

const form = new FormData();
form.append("file", file);

const { data } = await axios.post(
  "/api/upload-resume",
  form,
  { headers: { "Content-Type": "multipart/form-data" } }
);
console.log(data.upload_id, data.data.basics, data.ats_scores);`}),t.jsx(m,{children:"Success Response (200) — JSON Resume Schema"}),(0,t.jsxs)(u,{variant:"success",title:"JSON Resume Schema",children:["The response uses the standardized JSON Resume shape:"," ",t.jsx(o,{children:"basics"}),", ",t.jsx(o,{children:"work"}),","," ",t.jsx(o,{children:"education"}),", ",t.jsx(o,{children:"skills"}),","," ",t.jsx(o,{children:"projects"}),","," ",t.jsx(o,{children:"certificates"}),","," ",t.jsx(o,{children:"awards"}),","," ",t.jsx(o,{children:"publications"}),","," ",t.jsx(o,{children:"languages"}),","," ",t.jsx(o,{children:"interests"}),","," ",t.jsx(o,{children:"references"}),","," ",t.jsx(o,{children:"volunteer"}),"."]}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "message": "Resume uploaded and parsed successfully",
  "upload_id": 18,
  "resume_file": "resume_JOHN-DOE_18_1776874753.pdf",
  "schema": "jsonresume",
  "data": {
    "basics": {
      "name": "John Doe",
      "label": "Programmer",
      "image": "",
      "email": "john@gmail.com",
      "phone": "(912) 555-4321",
      "url": "https://johndoe.com",
      "summary": "A summary of John Doe…",
      "location": {
        "address": "2712 Broadway St",
        "postalCode": "CA 94115",
        "city": "San Francisco",
        "countryCode": "US",
        "region": "California"
      },
      "profiles": [{
        "network": "Twitter",
        "username": "john",
        "url": "https://twitter.com/john"
      }]
    },
    "work": [{
      "name": "Company",
      "position": "President",
      "url": "https://company.com",
      "startDate": "2013-01-01",
      "endDate": "2014-01-01",
      "summary": "Description…",
      "highlights": ["Started the company"]
    }],
    "education": [{
      "institution": "University",
      "url": "https://institution.com/",
      "area": "Software Development",
      "studyType": "Bachelor",
      "startDate": "2011-01-01",
      "endDate": "2013-01-01",
      "score": "4.0",
      "courses": ["DB1101 - Basic SQL"]
    }],
    "skills": [{
      "name": "Web Development",
      "level": "Master",
      "keywords": ["HTML", "CSS", "JavaScript"]
    }],
    "projects": [{
      "name": "Project",
      "startDate": "2019-01-01",
      "endDate": "2021-01-01",
      "description": "Description...",
      "highlights": ["Won award at AIHacks 2016"],
      "url": "https://project.com/"
    }],
    "certificates": [{
      "name": "Certificate",
      "date": "2021-11-07",
      "issuer": "Company",
      "url": "https://certificate.com"
    }],
    "awards": [{
      "title": "Award",
      "date": "2014-11-01",
      "awarder": "Company",
      "summary": "There is no spoon."
    }],
    "publications": [{
      "name": "Publication",
      "publisher": "Company",
      "releaseDate": "2014-10-01",
      "url": "https://publication.com",
      "summary": "Description…"
    }],
    "languages": [{
      "language": "English",
      "fluency": "Native speaker"
    }],
    "interests": [{
      "name": "Wildlife",
      "keywords": ["Ferrets", "Unicorns"]
    }],
    "references": [{
      "name": "Jane Doe",
      "reference": "Reference…"
    }],
    "volunteer": [{
      "organization": "Organization",
      "position": "Volunteer",
      "url": "https://organization.com/",
      "startDate": "2012-01-01",
      "endDate": "2013-01-01",
      "summary": "Description…",
      "highlights": ["Awarded 'Volunteer of the Month'"]
    }]
  },
  "ats_scores": {
    "overall_score": 75,
    "breakdown": {
      "contact_info": 80,
      "work_experience": 75,
      "education": 80,
      "skills": 70
    },
    "feedback": [
      "Add more quantitative achievements to your work experience.",
      "Consider adding links to your projects."
    ]
  }
}`}),(0,t.jsxs)(u,{variant:"warn",title:"Save the upload_id",children:[t.jsx(o,{children:"upload_id"})," is at the top level. Save it locally to fetch later via"," ",t.jsx(o,{children:"/api/resume/<upload_id>"})," or to render templates without re-uploading."]}),(0,t.jsxs)(u,{title:"Bidirectional",children:["The same JSON Resume payload can be sent back to"," ",t.jsx(o,{children:"/api/templates/<id>/html"})," or"," ",t.jsx(o,{children:"/render"})," — your data stays in the same shape end-to-end."]})]}),(0,t.jsxs)("section",{id:"get-resume",className:"scroll-mt-20",children:[t.jsx(j,{id:"get-resume-h",children:"2. Get Parsed Resume"}),t.jsx(c,{method:"GET",path:"/api/resume/{upload_id}"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Retrieve a previously parsed resume by its"," ",t.jsx(o,{children:"upload_id"}),". Returns JSON Resume schema plus ATS scores. No re-upload needed."]}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:"curl http://localhost:3000/api/resume/18"}),t.jsx(p,{children:"JavaScript"}),t.jsx(x,{children:`const res = await fetch(\`/api/resume/\${uploadId}\`);
const { data, ats_scores } = await res.json();`}),t.jsx(m,{children:"Response (200)"}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "message": "Resume fetched successfully",
  "upload_id": 18,
  "resume_file": "resume_JOHN-DOE_18_1776874753.pdf",
  "schema": "jsonresume",
  "data": {
    "basics": {...},
    "work": [...],
    "education": [...],
    "skills": [...],
    "projects": [...],
    "certificates": [...],
    "awards": [...],
    "publications": [...],
    "languages": [...],
    "interests": [...],
    "references": [...],
    "volunteer": [...]
  },
  "ats_scores": {
    "overall_score": 75,
    "breakdown": { "contact_info": 80, "work_experience": 75, "education": 80, "skills": 70 },
    "feedback": [
      "Add more quantitative achievements to your work experience.",
      "Consider adding links to your projects."
    ]
  }
}`}),(0,t.jsxs)(u,{variant:"warn",title:"Persistence note",children:["If ",t.jsx(o,{children:"upload_id"})," returns 404, the upload record was wiped (e.g. ephemeral container restart). Re-upload the PDF."]})]}),(0,t.jsxs)("section",{id:"jsonresume",className:"scroll-mt-20",children:[t.jsx(j,{id:"jsonresume-h",children:"3. Get as JSON Resume"}),t.jsx(c,{method:"GET",path:"/api/jsonresume/{upload_id}"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Identical payload to ",t.jsx(o,{children:"/api/resume/<id>"}),", but explicitly tagged with"," ",t.jsx(o,{children:'schema: "jsonresume"'})," and a"," ",t.jsx(o,{children:"spec_url"})," reference. Use this when you want clients to know the response conforms to the public spec."]}),t.jsx(m,{children:"Response (200)"}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "message": "JSON Resume fetched successfully",
  "schema": "jsonresume",
  "spec_url": "https://jsonresume.org/schema",
  "upload_id": 18,
  "data": { "basics": {...}, "work": [...], "education": [...], "skills": [...] }
}`}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:"curl http://localhost:3000/api/jsonresume/18"})]}),(0,t.jsxs)("section",{id:"response-schema",className:"scroll-mt-20",children:[t.jsx(j,{id:"response-schema-h",children:"4. Response Schema"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["The ",t.jsx(o,{children:"data"})," object follows the JSON Resume spec. Top-level keys:"]}),t.jsx(m,{children:"Top-level fields"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"upload_id"})}),t.jsx(g,{children:"integer"}),t.jsx(g,{children:"Save this to fetch data later"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"resume_file"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Server-generated filename"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"schema"})}),t.jsx(g,{children:"string"}),(0,t.jsxs)(g,{children:["Always ",t.jsx(o,{children:'"jsonresume"'})]})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"data"})}),t.jsx(g,{children:"object"}),t.jsx(g,{children:"JSON Resume payload (see below)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"ats_scores"})}),t.jsx(g,{children:"object"}),t.jsx(g,{children:"Overall score + breakdown + feedback"})]})]})]}),t.jsx(m,{children:"basics"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Full name"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"label"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Headline / current title"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"image"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Optional photo URL"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"email"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Primary email"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"phone"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Primary phone"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Portfolio / personal site"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"One-paragraph bio"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"location"})}),t.jsx(g,{children:"object"}),t.jsx(g,{children:"address, city, region, postalCode, countryCode"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"profiles[]"})}),t.jsx(g,{children:"array"}),t.jsx(g,{children:"network, username, url"})]})]})]}),t.jsx(m,{children:"work[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string (company)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"position"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"startDate"})}),t.jsx(g,{children:"string (YYYY-MM-DD)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"endDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"highlights[]"})}),t.jsx(g,{children:"array of strings (bullets)"})]})]})]}),t.jsx(m,{children:"education[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"institution"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"area"})}),t.jsx(g,{children:"string (field of study)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"studyType"})}),t.jsx(g,{children:"string (Bachelor, Master, ...)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"startDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"endDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"score"})}),t.jsx(g,{children:"string (GPA)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"courses[]"})}),t.jsx(g,{children:"array of strings"})]})]})]}),t.jsx(m,{children:"skills[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string (skill group)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"level"})}),t.jsx(g,{children:"string (Beginner ... Master)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"keywords[]"})}),t.jsx(g,{children:"array of strings"})]})]})]}),t.jsx(m,{children:"projects[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"description"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"highlights[]"})}),t.jsx(g,{children:"array of strings"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"startDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"endDate"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"certificates[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"date"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"issuer"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"awards[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"title"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"date"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"awarder"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"publications[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"publisher"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"releaseDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"languages[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"language"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"fluency"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"interests[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"keywords[]"})}),t.jsx(g,{children:"array of strings"})]})]})]}),t.jsx(m,{children:"references[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"name"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"reference"})}),t.jsx(g,{children:"string"})]})]})]}),t.jsx(m,{children:"volunteer[]"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"organization"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"position"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"url"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"startDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"endDate"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary"})}),t.jsx(g,{children:"string"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"highlights[]"})}),t.jsx(g,{children:"array of strings"})]})]})]}),t.jsx(m,{children:"ats_scores"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"overall_score"})}),t.jsx(g,{children:"number (0-100)"}),t.jsx(g,{children:"Composite ATS score"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"breakdown"})}),t.jsx(g,{children:"object"}),t.jsx(g,{children:"Per-section sub-scores"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"feedback[]"})}),t.jsx(g,{children:"array of strings"}),t.jsx(g,{children:"Human-readable tips"})]})]})]})]}),(0,t.jsxs)("section",{id:"list-templates",className:"scroll-mt-20",children:[t.jsx(j,{id:"list-templates-h",children:"5. List Templates"}),t.jsx(c,{method:"GET",path:"/api/templates"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Returns all 62 available resume templates. When neither"," ",t.jsx(o,{children:"page"})," nor ",t.jsx(o,{children:"limit"})," ","is provided, the full registry is returned in one shot."]}),t.jsx(m,{children:"Query Parameters (optional)"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Param"}),t.jsx(b,{children:"Values"}),t.jsx(b,{children:"Example"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"category"})}),t.jsx(g,{children:"modern, classic, creative"}),t.jsx(g,{children:t.jsx(o,{children:"?category=creative"})})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"is_premium"})}),t.jsx(g,{children:"true, false"}),t.jsx(g,{children:t.jsx(o,{children:"?is_premium=false"})})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"search"})}),t.jsx(g,{children:"any keyword (name, tag, description)"}),t.jsx(g,{children:t.jsx(o,{children:"?search=developer"})})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"page"})}),t.jsx(g,{children:"integer (default: 1)"}),t.jsx(g,{children:t.jsx(o,{children:"?page=2"})})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"limit"})}),t.jsx(g,{children:"integer (default: 10)"}),t.jsx(g,{children:t.jsx(o,{children:"?limit=5"})})]})]})]}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:'curl "http://localhost:3000/api/templates?category=modern&limit=5"'}),t.jsx(m,{children:"Response"}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "message": "Templates fetched successfully",
  "data": {
    "total": 62,
    "page": 1,
    "limit": 10,
    "pages": 7,
    "templates": [
      {
        "id": 1,
        "slug": "minimalist-clean",
        "name": "The Minimalist",
        "description": "Clean, structured layout with emphasis on typography.",
        "category": "modern",
        "thumbnail": "http://localhost:3000/static/templates/thumb/1.png",
        "color_scheme": {
          "primary": "#2c3e50",
          "secondary": "#f7f9fa",
          "text": "#333333",
          "accent": "#2c3e50"
        },
        "font_family": "Inter, sans-serif",
        "layout": "two_column",
        "is_premium": false,
        "template_file": "resume_1_minimalist.html",
        "sections": ["summary", "experience", "education", "skills"],
        "tags": ["minimal", "corporate", "ats-friendly"],
        "render_url": "http://localhost:3000/api/templates/1/render",
        "preview_url": "http://localhost:3000/api/templates/1/preview"
      }
    ]
  }
}`}),(0,t.jsxs)(u,{title:"Rendering a Template Gallery",children:["Use the ",t.jsx(o,{children:"thumbnail"})," URL for the gallery card image and the ",t.jsx(o,{children:"preview_url"})," when the user taps a template."]})]}),(0,t.jsxs)("section",{id:"single-template",className:"scroll-mt-20",children:[t.jsx(j,{id:"single-template-h",children:"6. Single Template"}),t.jsx(c,{method:"GET",path:"/api/templates/{id}"}),t.jsx("p",{className:"text-slate-700",children:"Fetch one template by numeric ID (1-62)."}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:"curl http://localhost:3000/api/templates/3"}),t.jsx(m,{children:"Response (200)"}),t.jsx(x,{children:`{
  "status": 200,
  "data": {
    "id": 3,
    "slug": "dark-mode-dev",
    "name": "Dark Mode Dev",
    "category": "modern",
    "layout": "two_column",
    "is_premium": false,
    "tags": ["developer", "dark", "tech", "engineering"],
    "render_url":  "http://localhost:3000/api/templates/3/render",
    "preview_url": "http://localhost:3000/api/templates/3/preview"
  }
}`})]}),(0,t.jsxs)("section",{id:"categories",className:"scroll-mt-20",children:[t.jsx(j,{id:"categories-h",children:"7. Template Categories"}),t.jsx(c,{method:"GET",path:"/api/templates/categories"}),t.jsx("p",{className:"text-slate-700",children:"Returns all unique categories with template counts."}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:"curl http://localhost:3000/api/templates/categories"}),t.jsx(m,{children:"Response"}),t.jsx(x,{children:`{
  "status": 200,
  "data": {
    "total": 3,
    "categories": [
      { "name": "modern",   "count": 28 },
      { "name": "classic",  "count": 19 },
      { "name": "creative", "count": 15 }
    ]
  }
}`})]}),(0,t.jsxs)("section",{id:"live-preview",className:"scroll-mt-20",children:[t.jsx(j,{id:"live-preview-h",children:"8. Live Preview (Form → HTML)"}),t.jsx(c,{method:"POST",path:"/api/templates/{id}/html"}),(0,t.jsxs)("p",{className:"text-slate-700",children:[t.jsx("strong",{children:"The main builder endpoint."})," Send a JSON Resume payload → get raw rendered HTML back. Perfect for real-time preview in an iframe's ",t.jsx(o,{children:"srcDoc"})," or a React Native ",t.jsx(o,{children:"WebView"})," while the user types."]}),(0,t.jsxs)(u,{variant:"success",title:"Accepts JSON Resume OR upload_id",children:["Send the full JSON Resume body, or just"," ",t.jsx(o,{children:'{ "upload_id": 18 }'})," to render a previously parsed resume from the server."]}),t.jsx(m,{children:"Request Body — Option A: Full JSON Resume"}),t.jsx(x,{children:`{
  "basics": {
    "name": "Poonam Batham",
    "email": "poonam@example.com",
    "phone": "+91-9399435171",
    "label": "Python Backend Developer",
    "summary": "Python Backend Developer with 3 years..."
  },
  "work": [
    {
      "name": "SummitCode",
      "position": "Agentic AI Engineer",
      "startDate": "2026-01-01",
      "endDate": "",
      "summary": "",
      "highlights": ["Built AI agents", "Integrated LLMs"]
    }
  ],
  "education": [
    {
      "institution": "ITM University",
      "studyType": "B.E.",
      "area": "Computer Science",
      "endDate": "2018-06-01"
    }
  ],
  "projects": [
    {
      "name": "Order Management System",
      "description": "Backend with Flask + RBAC",
      "highlights": ["Flask", "MySQL"]
    }
  ],
  "skills": [
    { "name": "Backend", "keywords": ["Python", "Django", "Flask"] }
  ],
  "certificates": [
    {
      "name": "AWS Certified",
      "issuer": "Amazon Web Services",
      "date": "2024-08-01"
    }
  ]
}`}),t.jsx(m,{children:"Request Body — Option B: From stored upload"}),t.jsx(x,{children:'{ "upload_id": 18 }'}),t.jsx(m,{children:"Response"}),(0,t.jsxs)("p",{className:"text-slate-700 text-sm",children:[t.jsx("strong",{children:"Raw HTML string"})," (Content-Type:"," ",t.jsx(o,{children:"text/html"}),"). Inject directly into an iframe's ",t.jsx(o,{children:"srcDoc"}),"."]}),t.jsx(m,{children:"Live Preview in React"}),t.jsx(x,{children:`"use client";
import { useState, useEffect } from "react";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ResumeBuilder() {
  const [templateId, setTemplateId] = useState(1);
  const [resume, setResume] = useState({
    basics: { name: "", email: "" },
    work: [],
    education: [],
    projects: [],
    skills: [],
    certificates: [],
  });

  const debounced = useDebounce(resume, 400);
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(\`/api/templates/\${templateId}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debounced),
    })
      .then((r) => r.text())
      .then(setHtml);
  }, [debounced, templateId]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <Form data={resume} onChange={setResume} />
      <iframe srcDoc={html} style={{ width: "100%", height: "100vh", border: 0 }} />
    </div>
  );
}`}),t.jsx(m,{children:"Live Preview in React Native"}),t.jsx(x,{children:`import { WebView } from "react-native-webview";

const [html, setHtml] = useState("");

useEffect(() => {
  const timer = setTimeout(async () => {
    const res = await fetch(\`\${API}/api/templates/\${id}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
    setHtml(await res.text());
  }, 400);
  return () => clearTimeout(timer);
}, [resume, id]);

<WebView source={{ html }} style={{ flex: 1 }} />`})]}),(0,t.jsxs)("section",{id:"render-json",className:"scroll-mt-20",children:[t.jsx(j,{id:"render-json-h",children:"9. Render Template (JSON wrapped)"}),t.jsx(c,{method:"POST",path:"/api/templates/{id}/render"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Same as ",t.jsx(o,{children:"/html"})," but returns HTML inside a JSON envelope. Useful when you need the HTML for post-processing (PDF conversion, storage, etc.)."]}),t.jsx(m,{children:"Request Body"}),(0,t.jsxs)("p",{className:"text-slate-700 text-sm",children:["JSON Resume payload, or ",t.jsx(o,{children:'{ "upload_id": N }'}),"."]}),t.jsx(m,{children:"Response"}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "message": "Template rendered successfully",
  "data": {
    "template_id": 3,
    "template_name": "Dark Mode Dev",
    "html": "<!DOCTYPE html><html>...</html>"
  }
}`}),t.jsx(p,{children:"cURL"}),t.jsx(x,{children:`curl -X POST http://localhost:3000/api/templates/3/render \\
  -H "Content-Type: application/json" \\
  -d '{"upload_id": 18}'`}),t.jsx(p,{children:"JavaScript"}),t.jsx(x,{children:`const res = await fetch(\`/api/templates/\${id}/render\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(resume),
});
const { data } = await res.json();
document.getElementById("preview").srcdoc = data.html;`})]}),(0,t.jsxs)("section",{id:"preview",className:"scroll-mt-20",children:[t.jsx(j,{id:"preview-h",children:"10. Preview Template (GET)"}),t.jsx(c,{method:"GET",path:"/api/templates/{id}/preview"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Returns rendered HTML directly (Content-Type:"," ",t.jsx(o,{children:"text/html"}),"). Ideal when you have a stored ",t.jsx(o,{children:"upload_id"})," and want a simple URL for iframe/WebView. Omit ",t.jsx(o,{children:"upload_id"})," for built-in sample data — useful for generating template thumbnails."]}),t.jsx(m,{children:"Query Parameters"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Param"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Description"})]})}),t.jsx("tbody",{children:(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"upload_id"})}),t.jsx(g,{children:"integer"}),t.jsx(g,{children:"Omit for built-in sample data"})]})})]}),t.jsx(m,{children:"Examples"}),t.jsx(x,{children:`# Sample data (for template thumbnails)
http://localhost:3000/api/templates/1/preview

# Real user data
http://localhost:3000/api/templates/3/preview?upload_id=18`}),t.jsx(p,{children:"React iframe"}),t.jsx(x,{children:`<iframe
  src={\`/api/templates/\${id}/preview?upload_id=\${uploadId}\`}
  style={{ width: "100%", height: "100vh", border: 0 }}
/>`}),t.jsx(p,{children:"React Native WebView"}),t.jsx(x,{children:`<WebView
  source={{ uri: \`\${API}/api/templates/\${templateId}/preview?upload_id=\${uploadId}\` }}
  style={{ flex: 1 }}
/>`}),t.jsx(u,{title:"When to use which?",children:(0,t.jsxs)("ul",{className:"list-disc pl-5 space-y-1 mt-1",children:[(0,t.jsxs)("li",{children:[t.jsx("strong",{children:"POST /html"})," — live preview while user types (JSON Resume → raw HTML)."]}),(0,t.jsxs)("li",{children:[t.jsx("strong",{children:"POST /render"})," — get HTML as a string (for PDF conversion, storage)."]}),(0,t.jsxs)("li",{children:[t.jsx("strong",{children:"GET /preview"})," — display a saved resume (upload_id already exists)."]})]})})]}),(0,t.jsxs)("section",{id:"available-templates",className:"scroll-mt-20",children:[t.jsx(j,{id:"available-templates-h",children:"11. Available Templates"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["All 62 templates available out of the box. Templates with"," ",t.jsx("strong",{children:"Photo"})," support a profile photo via"," ",t.jsx(o,{children:"basics.image"}),"."]}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"ID"}),t.jsx(b,{children:"Name"}),t.jsx(b,{children:"Category"}),t.jsx(b,{children:"Layout"}),t.jsx(b,{children:"Photo"}),t.jsx(b,{children:"Premium"})]})}),t.jsx("tbody",{children:n.TEMPLATES.map(e=>(0,t.jsxs)("tr",{children:[t.jsx(g,{children:e.id}),t.jsx(g,{children:t.jsx("span",{className:"font-medium text-slate-900",children:e.name})}),t.jsx(g,{children:t.jsx("span",{className:"inline-flex items-center text-[12px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700",children:e.category})}),t.jsx(g,{children:t.jsx("code",{className:"font-mono text-[12px] text-slate-600",children:e.layout})}),t.jsx(g,{children:e.supports_image?t.jsx("span",{className:"text-green-600 font-semibold",children:"Yes"}):t.jsx("span",{className:"text-slate-400",children:"—"})}),t.jsx(g,{children:e.is_premium?t.jsx("span",{className:"text-amber-700 font-semibold",children:"Premium"}):t.jsx("span",{className:"text-slate-500",children:"Free"})})]},e.id))})]})]}),(0,t.jsxs)("section",{id:"ats-analyze",className:"scroll-mt-20",children:[t.jsx(j,{id:"ats-analyze-h",children:"12. ATS Analyze"}),t.jsx(c,{method:"POST",path:"/api/ats-analyze"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["Score a resume with both rule-based + AI feedback. Submit a JSON Resume payload directly, or reference a previously uploaded resume by ",t.jsx(o,{children:"upload_id"}),"."]}),t.jsx(m,{children:"Request Body (one of the two)"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Name"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Required"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"resume"})}),t.jsx(g,{children:"object"}),t.jsx(g,{children:"*"}),t.jsx(g,{children:"JSON Resume object to analyze."})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"upload_id"})}),t.jsx(g,{children:"integer"}),t.jsx(g,{children:"*"}),t.jsx(g,{children:"Reference a stored upload instead of inlining."})]})]})]}),t.jsx(p,{children:"cURL — inline resume"}),t.jsx(x,{children:`curl -X POST http://localhost:3000/api/ats-analyze \\
  -H "Content-Type: application/json" \\
  -d '{"resume": {"basics": {"name": "Jane Doe", "email": "jane@example.com"}, "work": [], "education": []}}'`}),t.jsx(p,{children:"cURL — by upload_id"}),t.jsx(x,{children:`curl -X POST http://localhost:3000/api/ats-analyze \\
  -H "Content-Type: application/json" \\
  -d '{"upload_id": 18}'`}),t.jsx(p,{children:"JavaScript"}),t.jsx(x,{children:`const res = await fetch("/api/ats-analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ resume }),
});
const { rule_based, ai_analysis } = await res.json();`}),t.jsx(m,{children:"Response (200)"}),t.jsx(x,{children:`{
  "status": 200,
  "statusText": "OK",
  "rule_based": {
    "overall_score": 82,
    "breakdown": {
      "contact_info": 100,
      "work_experience": 80,
      "education": 90,
      "skills": 70
    },
    "feedback": [
      "Strong contact section.",
      "Add metrics to work bullets."
    ],
    "stats": {
      "word_count": 412,
      "bullet_count": 18,
      "quantified_bullets": 7,
      "action_verb_bullets": 14
    }
  },
  "ai_analysis": {
    "missing_sections": ["projects"],
    "weak_areas": [
      "Summary is too long",
      "Skills section lacks proficiency levels"
    ],
    "keyword_suggestions": ["TypeScript", "CI/CD", "Kubernetes"],
    "action_verb_upgrades": [
      { "from": "Worked on", "to": "Engineered" },
      { "from": "Helped with", "to": "Led" }
    ],
    "quantification_tips": [
      "Quantify the impact of your design system rebuild (e.g., reduced bundle size by X%)"
    ],
    "summary_rewrite": "Senior frontend engineer with 8+ years building production React apps...",
    "strengths": [
      "Quantified impact in last role",
      "Clear progression"
    ],
    "ats_risk_flags": [
      "References line still present",
      "Two-column layout may confuse some ATS parsers"
    ],
    "overall_recommendation": "Cut the summary, add metrics to 3 more bullets, and remove the references line.",
    "inferred_target_role": "Senior Frontend Engineer",
    "ai_powered": true
  }
}`})]}),(0,t.jsxs)("section",{id:"ai-feedback",className:"scroll-mt-20",children:[t.jsx(j,{id:"ai-feedback-h",children:"13. AI Feedback Structure"}),(0,t.jsxs)("p",{className:"text-slate-700",children:["The ",t.jsx(o,{children:"ai_analysis"})," object surfaces structured fields you can render directly into UI cards:"]}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Field"}),t.jsx(b,{children:"Type"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"missing_sections"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"Sections the resume is missing"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"weak_areas"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"Specific weaknesses with explanations"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"keyword_suggestions"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"Keywords to add for the target role"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"action_verb_upgrades"})}),t.jsx(g,{children:"{from, to}[]"}),t.jsx(g,{children:"Suggested replacements for weak verbs"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"quantification_tips"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"Hints for adding numbers/metrics"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"summary_rewrite"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Suggested rewritten professional summary"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"strengths"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"What the resume does well"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"ats_risk_flags"})}),t.jsx(g,{children:"string[]"}),t.jsx(g,{children:"Layout / formatting risks for ATS parsers"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"overall_recommendation"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"One-paragraph plan of action"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"inferred_target_role"})}),t.jsx(g,{children:"string"}),t.jsx(g,{children:"Role the AI inferred from the content"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(o,{children:"ai_powered"})}),t.jsx(g,{children:"boolean"}),(0,t.jsxs)(g,{children:[t.jsx(o,{children:"false"})," if the AI provider was unavailable and fallback rules were used"]})]})]})]}),(0,t.jsxs)(u,{variant:"warn",title:"Fallback behavior",children:["If the AI provider is unreachable,"," ",t.jsx(o,{children:"ai_powered"})," is"," ",t.jsx(o,{children:"false"})," and only"," ",t.jsx(o,{children:"rule_based"})," scores will be populated with meaningful data. Always check ",t.jsx(o,{children:"ai_powered"})," ","before rendering AI cards."]})]}),(0,t.jsxs)("section",{id:"errors",className:"scroll-mt-20",children:[t.jsx(j,{id:"errors-h",children:"14. Error Codes"}),t.jsx("p",{className:"text-slate-700",children:"All errors follow the same envelope shape so clients can handle them uniformly."}),t.jsx(x,{children:`{
  "status": 400,
  "statusText": "Bad Request",
  "message": "Human-readable message",
  "error_code": "ERROR_CODE",
  "data": null
}`}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"HTTP"}),t.jsx(b,{children:"Code"}),t.jsx(b,{children:"Meaning"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"400"}),t.jsx(g,{children:t.jsx(o,{children:"NO_FILE_FIELD"})}),(0,t.jsxs)(g,{children:["Missing ",t.jsx(o,{children:"file"})," field on upload"]})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"400"}),t.jsx(g,{children:t.jsx(o,{children:"EMPTY_FILENAME"})}),t.jsx(g,{children:"Uploaded file has empty filename"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"404"}),t.jsx(g,{children:t.jsx(o,{children:"NOT_FOUND"})}),t.jsx(g,{children:"Upload or template not found"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"413"}),t.jsx(g,{children:t.jsx(o,{children:"FILE_TOO_LARGE"})}),t.jsx(g,{children:"File exceeds 16 MB"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"415"}),t.jsx(g,{children:t.jsx(o,{children:"INVALID_FILE_TYPE"})}),t.jsx(g,{children:"Unsupported file type (only PDF accepted)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"422"}),t.jsx(g,{children:t.jsx(o,{children:"EMPTY_TEXT"})}),t.jsx(g,{children:"Couldn't extract text (scanned or corrupt PDF)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"422"}),t.jsx(g,{children:t.jsx(o,{children:"AI_PARSE_FAILED"})}),t.jsx(g,{children:"AI returned non-JSON response"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:"500"}),t.jsx(g,{children:t.jsx(o,{children:"SAVE_FAILED"})}),t.jsx(g,{children:"Server couldn't save the file"})]})]})]}),t.jsx(m,{children:"Defensive client handling"}),t.jsx(x,{children:`async function safeFetch(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    let body;
    try { body = await res.json(); } catch { body = {}; }
    const code = body.error_code || res.status;
    const message = body.message || res.statusText;
    throw new Error(\`[\${code}] \${message}\`);
  }
  return res.json();
}`})]}),(0,t.jsxs)("section",{id:"client-examples",className:"scroll-mt-20",children:[t.jsx(j,{id:"client-examples-h",children:"15. Client Examples — Complete Flow"}),t.jsx("p",{className:"text-slate-700",children:"Full pipeline: upload PDF → get parsed data → render with template → fetch ATS feedback."}),t.jsx(m,{children:"React (Web) — Full Builder + ATS"}),t.jsx(x,{children:`"use client";
import { useState, useEffect } from "react";

const API = "";  // same-origin

export default function ResumeApp() {
  const [templates, setTemplates] = useState([]);
  const [uploadId, setUploadId] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(1);
  const [html, setHtml] = useState("");
  const [ats, setAts] = useState(null);

  // 1) Load templates on mount
  useEffect(() => {
    fetch(\`\${API}/api/templates\`)
      .then((r) => r.json())
      .then((j) => setTemplates(j.data.templates));
  }, []);

  // 2) Handle PDF upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(\`\${API}/api/upload-resume\`, {
      method: "POST",
      body: form,
    });
    const j = await res.json();

    if (j.status !== 200) {
      alert(j.message);
      return;
    }
    setUploadId(j.upload_id);
    setParsed(j.data);
    setAts(j.ats_scores);  // initial rule-based scores
  };

  // 3) Re-render whenever template or data changes
  useEffect(() => {
    if (!parsed) return;
    fetch(\`\${API}/api/templates/\${selected}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    })
      .then((r) => r.text())
      .then(setHtml);
  }, [selected, parsed]);

  // 4) Get full AI feedback on demand
  const runAtsAnalysis = async () => {
    const res = await fetch(\`\${API}/api/ats-analyze\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: uploadId }),
    });
    setAts(await res.json());
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
      <aside>
        <input type="file" accept=".pdf" onChange={handleUpload} />
        <button onClick={runAtsAnalysis} disabled={!uploadId}>
          Run ATS Analysis
        </button>

        <h3>Pick a template</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {templates.map((t) => (
            <button key={t.id} onClick={() => setSelected(t.id)}>
              <img src={t.thumbnail} alt={t.name} style={{ width: "100%" }} />
              <div>{t.name}</div>
            </button>
          ))}
        </div>

        {ats?.rule_based && (
          <div>
            <h4>ATS score: {ats.rule_based.overall_score}/100</h4>
            <ul>
              {ats.rule_based.feedback.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </aside>

      <iframe srcDoc={html} style={{ width: "100%", height: "100vh", border: 0 }} />
    </div>
  );
}`}),t.jsx(m,{children:"React Native — Full Flow"}),t.jsx(x,{children:`import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";

const API = "http://192.168.1.10:3000";

export default function ResumeScreen() {
  const [templates, setTemplates] = useState([]);
  const [uploadId, setUploadId] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ats, setAts] = useState(null);

  // 1) Load templates
  useEffect(() => {
    fetch(\`\${API}/api/templates\`)
      .then((r) => r.json())
      .then((j) => setTemplates(j.data.templates));
  }, []);

  // 2) Pick + upload PDF
  const pickAndUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (res.canceled) return;
    const file = res.assets[0];

    const form = new FormData();
    form.append("file", { uri: file.uri, name: file.name, type: "application/pdf" });

    const r = await fetch(\`\${API}/api/upload-resume\`, {
      method: "POST",
      body: form,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const j = await r.json();
    setUploadId(j.upload_id);
    setParsed(j.data);
    setAts(j.ats_scores);
  };

  // 3) Run full AI ATS analysis
  const runAts = async () => {
    const r = await fetch(\`\${API}/api/ats-analyze\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: uploadId }),
    });
    setAts(await r.json());
  };

  // 4) Render template in a WebView
  if (selected && uploadId) {
    return (
      <WebView
        source={{ uri: \`\${API}/api/templates/\${selected}/preview?upload_id=\${uploadId}\` }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity onPress={pickAndUpload}>
        <Text>Upload Resume PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={runAts} disabled={!uploadId}>
        <Text>Run ATS Analysis</Text>
      </TouchableOpacity>

      {ats?.rule_based && (
        <View>
          <Text>Score: {ats.rule_based.overall_score}/100</Text>
        </View>
      )}

      <FlatList
        data={templates}
        numColumns={2}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelected(item.id)}>
            <Image source={{ uri: item.thumbnail }} style={{ width: 150, height: 200 }} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}`}),t.jsx(m,{children:"One-shot pipeline (Node / browser)"}),t.jsx(x,{children:`// File in → parsed JSON + rendered HTML + ATS feedback out
async function runFullPipeline(file, templateId = 1) {
  // 1. Upload
  const form = new FormData();
  form.append("file", file);
  const upload = await fetch("/api/upload-resume", { method: "POST", body: form }).then(r => r.json());

  // 2. Render + ATS in parallel
  const [html, ats] = await Promise.all([
    fetch(\`/api/templates/\${templateId}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upload.data),
    }).then((r) => r.text()),
    fetch("/api/ats-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: upload.upload_id }),
    }).then((r) => r.json()),
  ]);

  return { upload_id: upload.upload_id, data: upload.data, html, ats };
}`})]}),(0,t.jsxs)("section",{id:"cheatsheet",className:"scroll-mt-20",children:[t.jsx(j,{id:"cheatsheet-h",children:"16. API Cheatsheet"}),(0,t.jsxs)(y,{children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx(b,{children:"Method"}),t.jsx(b,{children:"Path"}),t.jsx(b,{children:"Description"})]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"POST"})}),t.jsx(g,{children:t.jsx(o,{children:"/api/upload-resume"})}),t.jsx(g,{children:"Upload PDF → parsed JSON Resume + ATS scores + upload_id"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/resume/","{upload_id}"]})}),t.jsx(g,{children:"Retrieve stored parsed resume"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/jsonresume/","{upload_id}"]})}),t.jsx(g,{children:"Same as above, with explicit JSON Resume envelope"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:t.jsx(o,{children:"/api/schema"})}),t.jsx(g,{children:"JSON Resume schema reference"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:t.jsx(o,{children:"/api/templates"})}),t.jsx(g,{children:"List all 62 templates (filter + paginate)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/templates/","{id}"]})}),t.jsx(g,{children:"Single template details"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:t.jsx(o,{children:"/api/templates/categories"})}),t.jsx(g,{children:"Category counts"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"POST"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/templates/","{id}","/html"]})}),(0,t.jsxs)(g,{children:[t.jsx("strong",{children:"Live preview"})," (JSON Resume → raw HTML)"]})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"POST"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/templates/","{id}","/render"]})}),t.jsx(g,{children:"Render template (HTML inside JSON envelope)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"GET"})}),t.jsx(g,{children:(0,t.jsxs)(o,{children:["/api/templates/","{id}","/preview"]})}),t.jsx(g,{children:"Preview saved resume (by upload_id)"})]}),(0,t.jsxs)("tr",{children:[t.jsx(g,{children:t.jsx(d,{method:"POST"})}),t.jsx(g,{children:t.jsx(o,{children:"/api/ats-analyze"})}),t.jsx(g,{children:"Rule-based + AI ATS feedback"})]})]})]}),t.jsx(u,{variant:"success",title:"You're ready to integrate.",children:"A mobile or web dev can hook up the full pipeline in under 30 minutes. Every endpoint speaks the same JSON Resume shape end to end — parse, render, analyze."})]}),t.jsx("div",{className:"h-24"})]})]})}),t.jsx(i.n,{})]})}},1506:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>c,metadata:()=>d});var t=r(9510),l=r(2232),i=r.n(l),n=r(8233),a=r.n(n);r(7272);let d={title:"Resume Builder — 62 templates, AI ATS scoring",description:"Free resume builder with 62 ATS-friendly templates, AI-powered ATS analysis, and live preview. No signup required.",metadataBase:new URL("http://localhost:3000")};function c({children:e}){return t.jsx("html",{lang:"en",className:`${i().variable} ${a().variable}`,children:t.jsx("body",{className:"min-h-screen bg-[#fafafa] font-sans text-slate-900 antialiased",children:e})})}},6560:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>n,metadata:()=>i});var t=r(9510),l=r(7371);let i={title:"Page not found — ResumeUp.AI"};function n(){return t.jsx("div",{className:"flex min-h-screen items-center justify-center bg-[#fafafa] px-6",children:(0,t.jsxs)("div",{className:"max-w-md text-center",children:[(0,t.jsxs)("div",{className:"mb-6 inline-flex items-center gap-2",children:[t.jsx("span",{className:"inline-block h-8 w-8 rounded-lg bg-brand-600"}),(0,t.jsxs)("span",{className:"text-lg font-semibold tracking-tight",children:["ResumeUp",t.jsx("span",{className:"text-brand-600",children:".AI"})]})]}),t.jsx("p",{className:"text-7xl font-semibold text-brand-600",children:"404"}),t.jsx("h1",{className:"mt-4 text-2xl font-semibold tracking-tight text-slate-900",children:"Page not found"}),t.jsx("p",{className:"mt-2 text-sm text-slate-500",children:"The page you were looking for doesn't exist or has been moved."}),(0,t.jsxs)("div",{className:"mt-6 flex items-center justify-center gap-3",children:[t.jsx(l.default,{href:"/",className:"inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700",children:"Back home"}),t.jsx(l.default,{href:"/templates",className:"inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-400",children:"Browse templates"})]})]})})}},664:(e,s,r)=>{"use strict";r.d(s,{Z:()=>i,h:()=>l});var t=r(8570);let l=(0,t.createProxy)(String.raw`D:\Resume-Pro\components\header.tsx#Header`),i=(0,t.createProxy)(String.raw`D:\Resume-Pro\components\header.tsx#default`)},9167:(e,s,r)=>{"use strict";r.d(s,{n:()=>i});var t=r(9510),l=r(7371);function i(){let e=new Date().getFullYear();return(0,t.jsxs)("footer",{className:"border-t border-slate-200 bg-white",children:[(0,t.jsxs)("div",{className:"mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[t.jsx("span",{className:"inline-block h-6 w-6 rounded-md bg-brand-600"}),t.jsx("span",{className:"font-semibold",children:"ResumeUp.AI"})]}),t.jsx("p",{className:"mt-3 max-w-xs text-sm text-slate-500",children:"The fastest way to build an ATS-friendly resume that actually gets read. No signup. No watermarks."})]}),(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900",children:"Product"}),(0,t.jsxs)("ul",{className:"mt-3 space-y-2 text-sm text-slate-500",children:[t.jsx("li",{children:t.jsx(l.default,{href:"/templates",className:"hover:text-slate-900",children:"Templates"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/builder",className:"hover:text-slate-900",children:"Builder"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/ats",className:"hover:text-slate-900",children:"ATS Analyzer"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/dashboard",className:"hover:text-slate-900",children:"My Resumes"})})]})]}),(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900",children:"Developers"}),(0,t.jsxs)("ul",{className:"mt-3 space-y-2 text-sm text-slate-500",children:[t.jsx("li",{children:t.jsx(l.default,{href:"/docs",className:"hover:text-slate-900",children:"API Docs"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/api/schema",className:"hover:text-slate-900",children:"JSON Resume Schema"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/api/templates",className:"hover:text-slate-900",children:"Templates API"})}),t.jsx("li",{children:t.jsx(l.default,{href:"/api/ats-analyze",className:"hover:text-slate-900",children:"ATS API"})})]})]}),(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"text-sm font-semibold text-slate-900",children:"Legal"}),(0,t.jsxs)("ul",{className:"mt-3 space-y-2 text-sm text-slate-500",children:[t.jsx("li",{children:t.jsx("span",{className:"text-slate-400",children:"Privacy"})}),t.jsx("li",{children:t.jsx("span",{className:"text-slate-400",children:"Terms"})})]})]})]}),(0,t.jsxs)("div",{className:"border-t border-slate-200 py-6 text-center text-xs text-slate-400",children:["\xa9 ",e," Code Krafters & ResumeUp.AI. All rights reserved."]})]})}},7272:()=>{}};var s=require("../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[276,961,698,822],()=>r(8530));module.exports=t})();