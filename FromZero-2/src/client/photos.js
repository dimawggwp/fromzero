// Тематические фото мини-проектов: assets/j-<id>.webp (замени на свои, имена по id проекта) и сцены лендинга.
import m1 from "./assets/j-m1.webp"; import m2 from "./assets/j-m2.webp"; import m3 from "./assets/j-m3.webp";
import d1 from "./assets/j-d1.webp"; import d2 from "./assets/j-d2.webp"; import d3 from "./assets/j-d3.webp";
import g1 from "./assets/j-g1.webp"; import g2 from "./assets/j-g2.webp"; import g3 from "./assets/j-g3.webp";
import a1 from "./assets/j-a1.webp"; import a2 from "./assets/j-a2.webp"; import a3 from "./assets/j-a3.webp";
import s1 from "./assets/j-s1.webp"; import s2 from "./assets/j-s2.webp"; import s3 from "./assets/j-s3.webp";
import c1 from "./assets/j-c1.webp"; import c2 from "./assets/j-c2.webp"; import c3 from "./assets/j-c3.webp";
import hero from "./assets/hero.webp";
import sceneResume from "./assets/scene_resume.webp";
import sceneJobs from "./assets/scene_jobs.webp";
import sceneSpacex from "./assets/scene_spacex.webp";
import sceneRehearsal from "./assets/scene_rehearsal.webp";
import scenePortfolio from "./assets/scene_portfolio.webp";

const src = (x) => (typeof x === "string" ? x : x?.src);
const MAP = { m1, m2, m3, d1, d2, d3, g1, g2, g3, a1, a2, a3, s1, s2, s3, c1, c2, c3 };
export const projectPhoto = (id) => src(MAP[id]);
export const SCENES = { hero: src(hero), resume: src(sceneResume), jobs: src(sceneJobs), spacex: src(sceneSpacex), rehearsal: src(sceneRehearsal), portfolio: src(scenePortfolio) };
