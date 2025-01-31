document.addEventListener('DOMContentLoaded', () => {
    // 필터 버튼 선택 처리
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 같은 그룹의 다른 버튼들 선택 해제
            const group = btn.closest('.filter-group');
            group.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('selected');
            });
            
            // 현재 버튼 선택
            btn.classList.add('selected');

            // 선택 효과 애니메이션
            btn.classList.add('animate-pulse');
            setTimeout(() => {
                btn.classList.remove('animate-pulse');
            }, 500);
        });
    });

    // 폼 제출 처리
    const form = document.getElementById('giftFilter');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 선택된 값들 수집
        const selected = {
            gender: form.querySelector('[data-type="gender"] .selected')?.dataset.value,
            age: form.querySelector('[data-type="age"] .selected')?.dataset.value,
            relation: form.querySelector('[data-type="relation"] .selected')?.dataset.value,
            season: form.querySelector('[data-type="season"] .selected')?.dataset.value
        };

        // 필수 선택 확인
        if (!selected.gender || !selected.age || !selected.relation || !selected.season) {
            alert('모든 항목을 선택해주세요! 😅');
            return;
        }

        // 결과 페이지로 이동
        const params = new URLSearchParams(selected);
        window.location.href = `results.html?${params.toString()}`;
    });
});
