// results.js

document.addEventListener('DOMContentLoaded', function() {
    const filters = getFilterParams();
    const filteredProducts = filterProducts(products, filters);
    displayResults(filteredProducts);
});

function getFilterParams() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    // 기본 파라미터 처리
    ['price', 'category', 'gender', 'age', 'relation', 'season'].forEach(key => {
        filters[key] = params.get(key) || '';
    });

    return filters;
}

function filterProducts(products, filters) {
    return products.filter(product => {
        // 각 필터 조건 확인
        const priceMatch = product.price === filters.price;
        const categoryMatch = product.category === filters.category;
        
        // 성별 매칭 ('a'는 모든 성별 허용)
        const genderMatch = product.gender === 'a' || product.gender === filters.gender;
        
        // 연령대 매칭 (배열 또는 단일값, 'a'는 모든 연령 허용)
        const ageMatch = product.age === 'a' || 
            (Array.isArray(product.age) ? 
                product.age.includes(filters.age) : 
                product.age === filters.age);
        
        // 관계 매칭 (배열 또는 단일값, 'a'는 모든 관계 허용)
        const relationMatch = product.relation === 'a' || 
            (Array.isArray(product.relation) ? 
                product.relation.includes(filters.relation) : 
                product.relation === filters.relation);
        
        // 계절 매칭 ('a'는 모든 계절 허용)
        const seasonMatch = product.season === 'a' || product.season === filters.season;

        // 모든 조건을 만족하는지 확인
        return priceMatch && 
               categoryMatch && 
               genderMatch && 
               ageMatch && 
               relationMatch && 
               seasonMatch;
    });
}

function displayResults(products) {
    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = '';

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

    products.forEach(product => {
        const card = createProductCard(product);
        resultsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:-translate-y-1 hover:shadow-xl';
    
    // 가격대 표시 형식 변환
    const priceDisplay = {
        '1m': '1만원대',
        '3m': '3만원대',
        '5m': '5만원대',
        '10m': '10만원대',
        '20m': '20만원대',
        'under50': '50만원 미만',
        'over50': '50만원 이상'
    }[product.price];

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" 
             class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-primary font-medium">${priceDisplay}</p>
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

function getCategoryName(category) {
    return {
        'digital': '디지털/가전',
        'health': '건강/운동',
        'pet': '반려동물',
        'fashion': '패션/잡화'
    }[category] || category;
}
