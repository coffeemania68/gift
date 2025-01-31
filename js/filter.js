document.addEventListener('DOMContentLoaded', () => {
    // 필터 버튼 선택 처리
    const filterGroups = document.querySelectorAll('.filter-group');
    
    filterGroups.forEach(group => {
        const buttons = group.querySelectorAll('.category-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 같은 그룹의 다른 버튼들 선택 해제
                buttons.forEach(b => {
                    b.classList.remove('selected');
                    b.querySelector('.icon-circle')?.classList.remove('bg-primary', 'border-primary');
                });
                
                // 현재 버튼 선택
                btn.classList.add('selected');
                btn.querySelector('.icon-circle')?.classList.add('bg-primary', 'border-primary');

                // 선택 효과 애니메이션
                const icon = btn.querySelector('.icon-circle');
                icon.classList.add('animate-bounce');
                setTimeout(() => {
                    icon.classList.remove('animate-bounce');
                }, 500);
            });
        });
    });

    // 폼 제출 처리
    const form = document.getElementById('giftFilter');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 선택된 값들 수집
        const selected = {
            price: form.querySelector('[data-type="price"] .selected')?.dataset.value,
            category: form.querySelector('[data-type="category"] .selected')?.dataset.value,
            gender: form.querySelector('[data-type="gender"] .selected')?.dataset.value,
            age: form.querySelector('[data-type="age"] .selected')?.dataset.value,
            relation: form.querySelector('[data-type="relation"] .selected')?.dataset.value,
            season: form.querySelector('[data-type="season"] .selected')?.dataset.value
        };

        // 필수 선택 확인
        const missingFilters = Object.entries(selected)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFilters.length > 0) {
            const filterNames = {
                price: '예산',
                category: '카테고리',
                gender: '성별',
                age: '연령대',
                relation: '관계',
                season: '계절'
            };
            
            alert(`다음 항목을 선택해주세요! 😅\n${missingFilters.map(f => filterNames[f]).join(', ')}`);
            return;
        }

        // 결과 페이지로 이동
        const params = new URLSearchParams(selected);
        window.location.href = `results.html?${params.toString()}`;
    });
});
