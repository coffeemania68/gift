// results.js

document.addEventListener('DOMContentLoaded', function() {
    const filters = getFilterParams();
    console.log('Filters:', filters);  // 필터 값 확인
    console.log('Products:', products);  // products 데이터 확인
    
    const filteredProducts = filterProducts(products, filters);
    console.log('Filtered Products:', filteredProducts);  // 필터링 결과 확인
    
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
    
    const heartMessages = [
        "마음을 담아 선물하세요 💝",
        "특별한 마음을 전하세요 ❤️",
        "당신의 마음이 닿을 거예요 💖",
        "감동이 될 선물이에요 💗",
        "사랑을 담아 준비했어요 💓"
    ];
    
    const randomMessage = heartMessages[Math.floor(Math.random() * heartMessages.length)];
    
    card.innerHTML = `
        <div class="aspect-w-1 aspect-h-1 w-full">
            <img src="${product.image}" alt="${product.name}" 
                 class="w-full h-48 object-contain">
        </div>
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-primary font-medium mb-2">${priceDisplay}</p>
            <p class="text-sm text-gray-600 italic mb-4 animate-fade-in animate-pulse">
                ${randomMessage}
            </p>
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
