// filter.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('giftFilter');
    
    // 폼 제출 이벤트 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 모든 select 요소의 값을 수집
        const filters = {
            price: form.querySelector('[data-type="price"] select').value,
            category: form.querySelector('[data-type="category"] select').value,
            gender: form.querySelector('[data-type="gender"] select').value,
            age: form.querySelector('[data-type="age"] select').value,
            relation: form.querySelector('[data-type="relation"] select').value,
            season: form.querySelector('[data-type="season"] select').value
        };

        // 필수 선택 검증
        if (!validateFilters(filters)) {
            alert('모든 항목을 선택해주세요.');
            return;
        }

        // 필터 조건을 쿼리 파라미터로 변환
        const queryString = createQueryString(filters);
        
        // results.html로 이동
        window.location.href = `results.html${queryString}`;
    });

    // select 요소들의 변경 이벤트 처리
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // select가 선택되면 테두리 색상 변경
            if (this.value) {
                this.classList.add('border-primary');
            } else {
                this.classList.remove('border-primary');
            }
        });
    });
});

// 필터 검증 함수
function validateFilters(filters) {
    // 모든 필터가 선택되었는지 확인
    for (let key in filters) {
        if (!filters[key]) {
            return false;
        }
    }
    return true;
}

// 쿼리 스트링 생성 함수
function createQueryString(filters) {
    const params = new URLSearchParams();
    
    // 각 필터 값을 처리
    for (let key in filters) {
        // 'all' 값은 특별 처리
        if (filters[key] === 'all') {
            // OR 조건인 경우 특별 파라미터 추가
            if (['season', 'category', 'price'].includes(key)) {
                params.append(`${key}All`, 'true');
            }
        } else {
            // 일반 필터 값 추가
            params.append(key, filters[key]);
        }
    }

    return `?${params.toString()}`;
}

// URL 파라미터 파싱 함수 (results.html에서 사용)
function getFilterParams() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    // 기본 파라미터 처리
    ['price', 'category', 'gender', 'age', 'relation', 'season'].forEach(key => {
        filters[key] = params.get(key) || '';
    });

    // OR 조건 파라미터 처리
    ['season', 'category', 'price'].forEach(key => {
        filters[`${key}All`] = params.get(`${key}All`) === 'true';
    });

    return filters;
}
