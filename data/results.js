// results.js

document.addEventListener('DOMContentLoaded', function() {
    // URL에서 필터 파라미터 가져오기
    const filters = getFilterParams();
    
    // 상품 필터링
    const filteredProducts = filterProducts(products, filters);
    
    // 결과 표시
    displayResults(filteredProducts);
});

// URL 파라미터 파싱 함수
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

// 상품 필터링 함수
function filterProducts(products, filters) {
    return products.filter(product => {
        // 기본 필터 조건 (AND)
        const basicConditions = [
            // 성별은 정확히 일치
            product.gender === filters.gender,
            // 연령대 일치
            product.age === filters.age,
            // 관계 일치
            product.relation === filters.relation
        ];

        // OR 조건 처리
        const priceCondition = filters.priceAll || product.price === filters.price;
        const categoryCondition = filters.categoryAll || product.category === filters.category;
        const seasonCondition = filters.seasonAll || product.season === filters.season;

        return basicConditions.every(condition => condition) && 
               priceCondition && 
               categoryCondition && 
               seasonCondition;
    });
}

// 결과 표시 함수
function displayResults(products) {
    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = ''; // 기존 결과 초기화

    if (products.length === 0) {
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500 mb-4">해당하는 선물이 없습니다.</p>
                <button onclick="window.location.href='index.html'" 
                        class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transform transition hover:scale-105">
                    🔍 다시 검색하기
                </button>
            </div>
        `;
        return;
    }

    // 결과 카드 생성
    products.forEach(product => {
        const card = createProductCard(product);
        resultsGrid.appendChild(card);
    });
}

// 상품 카드 생성 함수
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:-translate-y-1 hover:shadow-xl';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" 
             class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-primary font-medium">${Number(product.price).toLocaleString()}원</p>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">${getCategoryName(product.category)}</span>
                <a href="${product.link}" target="_blank" 
                   class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm transition">
                    구매하기
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// 카테고리 이름 변환 함수
function getCategoryName(category) {
    const categories = {
        'digital': '디지털/가전',
        'health': '건강/운동',
        'pet': '반려동물',
        'fashion': '패션/잡화'
    };
    return categories[category] || category;
}
