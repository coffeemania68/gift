document.addEventListener('DOMContentLoaded', function() {
    const filters = getFilterParams();
    console.log('Filters:', filters); // 디버깅용
    
    // 개인화된 메시지 설정
    const headerMessage = document.getElementById('personalizedMessage');
    headerMessage.textContent = getPersonalizedMessage(filters.relation);
    
    // 상품 필터링 및 표시
    const filteredProducts = filterProducts(products, filters);
    console.log('Filtered Products:', filteredProducts); // 디버깅용
    displayResults(filteredProducts);
});

function getPersonalizedMessage(relation) {
    const messages = {
        'f': '가족을 위해 엄선한 선물들이에요! 💝',
        'p': '부모님을 위해 정성스레 골라봤어요! 💖',
        'l': '연인에게 줄 특별한 선물이에요! 💕',
        'c': '소중한 친구를 위한 선물이에요! 🎁',
        'b': '사랑하는 형제자매를 위한 선물이에요! 💝',
        't': '선생님을 위한 감사의 선물이에요! 🙏',
        'w': '직장동료를 위한 센스있는 선물이에요! 🎯',
        'e': '어르신을 위한 효도 선물이에요! 💝',
        'k': '귀여운 아이를 위한 선물이에요! 🧸',
        'default': '소중한 분을 위해 엄선한 선물이에요! 🎁'
    };
    return messages[relation] || messages['default'];
}

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
