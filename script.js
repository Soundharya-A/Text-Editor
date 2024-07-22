document.addEventListener('DOMContentLoaded', function() {
    const fontFamilySelector = document.getElementById('font-family-selector');
    const fontWeightSelector = document.getElementById('font-weight-selector');
    const italicToggle = document.getElementById('italic-toggle');
    const editor = document.getElementById('editor');

    let fontsData;

    // Load the fonts JSON file
    fetch('punt-frontend-assignment.json')
        .then(response => response.json())
        .then(data => {
            fontsData = data;
            populateFontFamilySelector(data);
            loadSavedSettings();
        });

    function populateFontFamilySelector(fonts) {
        for (let font in fonts) {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontFamilySelector.appendChild(option);
        }
    }

    function populateFontWeightSelector(variants) {
        fontWeightSelector.innerHTML = '<option value="">Select Font Weight</option>';
        variants.forEach(variant => {
            const option = document.createElement('option');
            option.value = variant;
            option.textContent = variant;
            fontWeightSelector.appendChild(option);
        });
    }

    function updateFont() {
        const fontFamily = fontFamilySelector.value;
        const fontWeight = fontWeightSelector.value;
        const italic = italicToggle.checked ? 'italic' : 'normal';

        let fontUrl = fontsData[fontFamily].url;
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        editor.style.fontFamily = fontFamily;
        editor.style.fontWeight = fontWeight.replace('italic', '') || 'normal';
        editor.style.fontStyle = italic;
    }

    function loadSavedSettings() {
        const savedText = localStorage.getItem('editorText');
        const savedFontFamily = localStorage.getItem('editorFontFamily');
        const savedFontWeight = localStorage.getItem('editorFontWeight');
        const savedItalic = localStorage.getItem('editorItalic') === 'true';

        if (savedText) editor.value = savedText;
        if (savedFontFamily) fontFamilySelector.value = savedFontFamily;
        if (savedFontWeight) fontWeightSelector.value = savedFontWeight;
        italicToggle.checked = savedItalic;

        if (savedFontFamily) {
            populateFontWeightSelector(fontsData[savedFontFamily].variants);
            fontWeightSelector.disabled = false;
            italicToggle.disabled = false;
            updateFont();
        }
    }

    fontFamilySelector.addEventListener('change', function() {
        const selectedFont = fontFamilySelector.value;
        if (selectedFont) {
            populateFontWeightSelector(fontsData[selectedFont].variants);
            fontWeightSelector.disabled = false;
        } else {
            fontWeightSelector.disabled = true;
            italicToggle.disabled = true;
        }
        updateFont();
    });

    fontWeightSelector.addEventListener('change', function() {
        const selectedFont = fontFamilySelector.value;
        const selectedWeight = fontWeightSelector.value;
        italicToggle.disabled = !fontsData[selectedFont].variants.includes(selectedWeight + 'italic');
        updateFont();
    });

    italicToggle.addEventListener('change', updateFont);

    editor.addEventListener('input', function() {
        localStorage.setItem('editorText', editor.value);
    });

    fontFamilySelector.addEventListener('change', function() {
        localStorage.setItem('editorFontFamily', fontFamilySelector.value);
    });

    fontWeightSelector.addEventListener('change', function() {
        localStorage.setItem('editorFontWeight', fontWeightSelector.value);
    });

    italicToggle.addEventListener('change', function() {
        localStorage.setItem('editorItalic', italicToggle.checked);
    });
});
