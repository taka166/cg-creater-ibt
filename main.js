document.addEventListener('DOMContentLoaded', () => {

    const makeTextBold = (text) => {
        if (!text) return "";
        // "図"のあとに数字（半角・全角）が続く部分を太字タグで囲む
        return text.replace(/(図\s*[0-9０-９]+)/g, '<strong>$1</strong>');
    };

    const quizContainer = document.getElementById('quiz-container');
    const gradeBtn = document.getElementById('grade-btn');
    const scoreDisplay = document.getElementById('score-display');

    try {
        // quiz_data.js から読み込まれた quizData があるか確認
        if (typeof quizData === 'undefined' || !quizData || !quizData.length) {
            throw new Error('問題データ (quizData) が見つかりません。');
        }

        let currentGroupId = null;
        let currentGroupBlock = null;

        quizData.forEach((q) => {
          
            let groupId = '';
            const matchNum = q.id.match(/^q(\d+)_(\d+)$/);
            const matchChar = q.id.match(/^q(\d+)([a-z])$/);

            if (matchNum) {
                groupId = `q${matchNum[1]}`;
            } else if (matchChar) {
                groupId = `q${matchChar[1]}`;
            } else {
                groupId = q.id;
            }

            // 新しい大問グループの開始
            if (groupId !== currentGroupId) {
                currentGroupId = groupId;
                currentGroupBlock = document.createElement('section');
                currentGroupBlock.className = 'question-group';
                currentGroupBlock.id = `group-${groupId}`;

                const titleNum = groupId.replace('q', '');
                let groupTitleText = `第${titleNum}問`;
                if (groupId === 'q1') groupTitleText += ' <共通問題>';

                const titleEl = document.createElement('h2');
                titleEl.className = 'group-title';
                titleEl.textContent = groupTitleText;
                currentGroupBlock.appendChild(titleEl);
                quizContainer.appendChild(currentGroupBlock);
            }

            const questionBlock = document.createElement('div');
            questionBlock.className = 'sub-question';
            questionBlock.id = `question-${q.id}`;

            let questionHTML = '';

            // --- 問題文 ---
            if (q.question_text) {
            
                const fmtText = makeTextBold(q.question_text);
                questionHTML += `<p class="question-text">${fmtText.replace(/\n/g, '<br>')}</p>`;
            }
            if (q.question_text_raw) {
                questionHTML += `<pre class="question-text-raw">${q.question_text_raw}</pre>`;
            }

            // --- 問題の画像 (図1, 図2など) ---
            if (q.images && q.images.length > 0) {
                let divClass = 'question-images';
                if (q.id === 'q2b') divClass += ' q2b-layout';
                else if ( q.id === 'q2c') divClass += ' horizontal-group-2';
                else if ( q.id === 'q2a') divClass += ' horizontal-group-3';
                else if (['q7c', 'q7d', 'q9a', 'q9b', 'q8c'].includes(q.id)) divClass += ' horizontal-group-2';
                else if (q.id === 'q3a') divClass += ' horizontal-group-2';
                else if (q.id === 'q4d') divClass += ' horizontal-group-4';                
                else if (q.images.length > 1) divClass += ' horizontal-group';

                questionHTML += `<div class="${divClass}">`;
                
                let captions = [];
                if (q.id === 'q2b') captions = ["〈1〉円柱", "〈2〉トーラス", "〈3〉配置", "〈4〉モデルA", "〈5〉モデルB"];
                else if (q.id === 'q2a' || q.id === 'q2c') captions = ["〈1〉断面形状", "〈2〉レールの軌道", "〈3〉"];
                else if (q.id === 'q3a') captions = ["図1", "図2"];
                else if (q.id === 'q3b') captions = ["図3", "図4"];
                else if (q.id === 'q3d') captions = ["図6", "図7"];
                else if (q.id === 'q4a') captions = ["図1"];
                else if (q.id === 'q4b') captions = ["図2"];
                else if (q.id === 'q4c') captions = ["図3", "図4"];
                else if (q.id === 'q4d') captions = ["〈1〉", "〈2〉", "〈3〉", "〈4〉"];
                else if (q.id === 'q5a') captions = ["図1"];
                else if (q.id === 'q5b') captions = ["図2","図3","図4"];
                else if (q.id === 'q5d') captions = ["図5", "図6"];
                else if (q.id === 'q6a') captions = ["図1", "図2"];
                else if (q.id === 'q6b') captions = ["図3", "図4"];
                else if (q.id === 'q6c') captions = ["図5"];
                else if (q.id === 'q6d') captions = ["図6", "図7"];
                else if (q.id === 'q7a') captions = ["図1"];
                else if (q.id === 'q7d') captions = ["図5", "図6"];
                else if (q.id === 'q8a') captions = ["図1"];
                else if (q.id === 'q8c') captions = ["〈1〉", "〈2〉"]
                else if (q.id === 'q8c') captions = ["図2"]
                else if (q.id === 'q8d') captions = ["図3"]
                else if (q.id === 'q9a') captions = ["図1", "図2"]
                else if (q.id === 'q9b') captions = ["図3", "図4"]
                else if (q.id === 'q9d') captions = ["図5"]
                else if (q.id === 'q10c') captions = ["図1", "図2"];
                q.images.forEach((imgPath, idx) => {
                    let caption = captions[idx] || '';
                    
                    // 特殊なキャプション設定
                    if (q.id === 'q7c') caption = idx === 0 ? '図2' : (idx === 1 ? '図3' : '図4');
                    if (q.id === 'q3c') caption = '図5';
                    if (q.id === 'q10a' && idx >= 4) return;

                    // ★追加：q2cの3枚目(index 2)の時だけ、「図3」という文字を強制的に追加
                    if (q.id === 'q2c' && idx === 2) {
                        caption += '<div style="font-weight:bold; margin-top:5px; font-size:16px; color:#000;">図3</div>';
                    }

                    caption = makeTextBold(caption);
                    
                    questionHTML += `
                        <figure>
                            <img src="${imgPath}" alt="図" class="question-model">
                            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
                        </figure>
                    `;
                });
                questionHTML += '</div>';

                if (q.figure_notes) {
                    questionHTML += '<div class="figure-notes">';
                    q.figure_notes.forEach(note => questionHTML += `<span>${note}</span><br>`);
                    questionHTML += '</div>';
                }
            }

           // ===============================================
            // 3. 選択肢 (ラジオボタン & 画像対応)
            // ===============================================
            if (q.choices && q.choices.length > 0) {
                questionHTML += '<div class="answer-group">';
                
                // 正誤マーク表示エリア
                questionHTML += `
                    <div class="result-header">
                        <h4>【解答群】</h4>
                        <span class="result-mark" id="result-${q.id}"></span>
                    </div>`;

                // ラジオボタンのグループ名 (問題IDごとに分ける)
                const inputName = `answer-${q.id}`;

                if (q.table_header) {
                    // --- 表形式の選択肢 ---
                    questionHTML += '<table class="choice-table"><thead><tr><th>選択</th>';
                    q.table_header.forEach(h => questionHTML += `<th>${h.replace(/\n/g, '<br>')}</th>`);
                    questionHTML += '</tr></thead><tbody>';
                    
                    q.choices.forEach(c => {
                        questionHTML += '<tr>';
                        questionHTML += `
                            <td class="radio-cell">
                                <label class="radio-label">
                                    <input type="radio" name="${inputName}" value="${c.label}">
                                    <span class="choice-symbol">${c.label}</span>
                                </label>
                            </td>`;
                        
                        q.table_header.forEach(h => {
                            const val = (c.text_parts && c.text_parts[h]) ? c.text_parts[h] : '';
                            questionHTML += `<td>${val.replace(/\n/g, '<br>')}</td>`;
                        });
                        questionHTML += '</tr>';
                    });
                    questionHTML += '</tbody></table>';

                } else {
                    // --- 通常形式（テキスト または 画像） ---
                    const imageChoiceQuestions = ['q3c', 'q7c', 'q9d', 'q10c', 'q4a', 'q5a', 'q5d'];
                    const hasImages = q.choices.some(c => c.image) || imageChoiceQuestions.includes(q.id);
                    const className = hasImages ? 'choices image-choices' : 'choices text-choices-row';

                    questionHTML += `<div class="${className}">`;
                    
                    let startIndex = 0;
                    if (q.id === 'q10a' || q.id === 'q7c') startIndex = q.images.length;
                    if (q.id === 'q3c') startIndex = 1;

                    q.choices.forEach((c, idx) => {
                        let content = '';
                        let cImg = c.image;

                        if (!cImg && imageChoiceQuestions.includes(q.id)) {
                             if (q.images && q.images[startIndex + idx]) {
                                 cImg = q.images[startIndex + idx];
                             }
                        }

                        if (cImg) {
                            content = `<img src="${cImg}" alt="${c.label}">`;
                        } else {
                            const text = c.text || c.text_raw || '';
                            content = `<span class="choice-text">${text}</span>`;
                        }

                        // ラジオボタンの生成
                        questionHTML += `
                            <label class="choice-item radio-label">
                                <div style="display:flex; align-items:center;">
                                    <input type="radio" name="${inputName}" value="${c.label}">
                                    <span class="choice-label">${c.label}.</span>
                                </div>
                                ${content}
                            </label>
                        `;
                    });
                    questionHTML += '</div>';
                }
                questionHTML += '</div>'; // end answer-group
            }

            questionBlock.innerHTML = questionHTML;
            currentGroupBlock.appendChild(questionBlock);
        });

    } catch (error) {
        console.error(error);
        quizContainer.textContent = `システムエラー: ${error.message}`;
    }


    if (gradeBtn) {
        gradeBtn.addEventListener('click', () => {
            if (typeof correctAnswers === 'undefined') {
                alert('正解データ (answers.js) が読み込まれていません。');
                return;
            }

            let correctCount = 0;
            let totalCount = 0;
            quizData.forEach(q => {
                const correctVal = correctAnswers[q.id];
                if (!correctVal) return; 

                totalCount++;
                
            
                const selected = document.querySelector(`input[name="answer-${q.id}"]:checked`);
                const resultMark = document.getElementById(`result-${q.id}`);
                const questionDiv = document.getElementById(`question-${q.id}`);

                if (selected && selected.value === correctVal) {
                  
                    correctCount++;
                    if (resultMark) {
                        resultMark.textContent = "⭕ 正解！";
                        resultMark.className = "result-mark correct";
                    }
                    questionDiv.classList.add("answered-correct");
                    questionDiv.classList.remove("answered-wrong");
                } else {
                
                    if (resultMark) {
                        resultMark.textContent = `❌ 不正解 (正解: ${correctVal})`;
                        resultMark.className = "result-mark wrong";
                    }
                    questionDiv.classList.add("answered-wrong");
                    questionDiv.classList.remove("answered-correct");
                }
            });

            if (scoreDisplay) {
                scoreDisplay.textContent = `あなたの得点: ${correctCount} / ${totalCount}`;
            }
            
            // 採点ボタンの下へスクロール
            gradeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });   
    }

    const groups = document.querySelectorAll('.question-group');
    const gradingArea = document.querySelector('.grading-area');
    let currentStep = 0; // 現在表示している大問のインデックス

    // グループが1つ以上ある場合のみ実行
    if (groups.length > 0) {
        
        // 1. ナビゲーションボタンエリアを作成して配置
        const navDiv = document.createElement('div');
        navDiv.className = 'nav-buttons';
        navDiv.innerHTML = `
            <button id="btn-prev" class="nav-btn">＜ 前へ</button>
            <button id="btn-next" class="nav-btn next">次へ ＞</button>
        `;
        
        // 採点ボタンのエリアの手前に挿入
        if (gradingArea) {
            gradingArea.parentNode.insertBefore(navDiv, gradingArea);
        } else {
            quizContainer.parentNode.appendChild(navDiv);
        }

        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        // 2. 表示を更新する関数
        const updateView = () => {
            // すべてのグループを非表示
            groups.forEach(g => g.classList.remove('active'));
            // 現在のグループだけ表示
            groups[currentStep].classList.add('active');

            // 画面トップへスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // ボタンの制御
            btnPrev.disabled = (currentStep === 0);
            
            // 最後のページかどうか
            if (currentStep === groups.length - 1) {
                btnNext.style.display = 'none'; // 次へボタンを隠す
                if(gradingArea) gradingArea.style.display = 'block'; // 採点ボタンを表示
            } else {
                btnNext.style.display = 'block'; // 次へボタンを表示
                btnNext.textContent = '次へ ＞';
                if(gradingArea) gradingArea.style.display = 'none'; // 採点ボタンを隠す
            }
        };
        btnPrev.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateView();
            }
        });

        btnNext.addEventListener('click', () => {
            if (currentStep < groups.length - 1) {
                currentStep++;
                updateView();
            }
        });
        updateView();
    }
    });
 