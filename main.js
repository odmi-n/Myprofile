(function () {
  'use strict';

  // =========================
  // ここだけ書き換えればOK（データ定義）
  // =========================
  const PROFILE = {
    name: '山田 太郎',                 // ← あなたの名前
    occupation: 'ソフトウェアエンジニア', // ← 一番目立たせる職業
    age: 21,                          // ← 整数（未設定なら null）
    updatedAt: '2025-08-23T12:00:00Z',// ← ISO8601（未設定なら null）
    version: 1
  };

  // =========================
  // 以下、アプリ本体（編集不要）
  // =========================
  const $ = (id) => document.getElementById(id);
  const elRole = $('role');
  const elName = $('name');
  const elAge = $('age');
  const elUpdated = $('updated');
  const elYear = $('year');
  const ld = $('ld-json');

  // 年号
  elYear.textContent = String(new Date().getFullYear());

  function setBusy(busy) {
    const hero = document.querySelector('.hero');
    hero?.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  function removeSkeleton() {
    [elRole, elName, elAge, elUpdated].forEach(el => el && el.classList.remove('skeleton'));
  }

  function sanitizeProfile(p) {
    const o = Object.create(null);
    o.name = (typeof p.name === 'string' && p.name.trim()) ? p.name.trim() : '';
    o.occupation = (typeof p.occupation === 'string' && p.occupation.trim())
      ? p.occupation.trim()
      : '職業情報が未設定';
    if (Number.isInteger(p.age) && p.age >= 0 && p.age <= 120) {
      o.age = p.age;
    } else {
      o.age = null;
    }
    o.updatedAt = (typeof p.updatedAt === 'string' && !Number.isNaN(Date.parse(p.updatedAt)))
      ? p.updatedAt
      : null;
    o.version = Number.isInteger(p.version) ? p.version : 1;
    return o;
  }

  function formatDateYYYYMMDD(iso) {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${y}.${m}.${da}`;
    } catch {
      return '';
    }
  }

  function render(profile) {
    const { name, occupation, age, updatedAt } = profile;

    // 内容差し込み（textContentのみ）
    elRole.textContent = occupation;
    elName.textContent = name || '';
    if (age === null) {
      elAge.style.display = 'none';
    } else {
      elAge.style.display = '';
      elAge.textContent = `${age}歳`;
    }
    if (!updatedAt) {
      elUpdated.style.display = 'none';
    } else {
      elUpdated.style.display = '';
      elUpdated.textContent = `最終更新：${formatDateYYYYMMDD(updatedAt)}`;
    }

    // タイトル/メタ
    if (occupation && name) {
      document.title = `${occupation} | ${name}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      const desc = `${name}（${occupation}）の自己紹介ページ。職業・名前・年齢をシンプルに表示します。`;
      if (metaDesc) metaDesc.setAttribute('content', desc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      ogTitle?.setAttribute('content', document.title);
      ogDesc?.setAttribute('content', desc);
    }

    // JSON-LD 上書き
    try {
      const data = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: name || '',
        jobTitle: occupation || '',
        birthDate: null
      };
      if (ld) ld.textContent = JSON.stringify(data);
    } catch { /* no-op */ }

    removeSkeleton();
    setBusy(false);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setBusy(true);
    const prof = sanitizeProfile(PROFILE);
    render(prof);
  });
})();
