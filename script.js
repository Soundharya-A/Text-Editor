document.addEventListener('DOMContentLoaded', function() {
    const fontFamilySelector = document.getElementById('font-family-selector');
    const fontWeightSelector = document.getElementById('font-weight-selector');
    const italicToggle = document.getElementById('italic-toggle');
    const editor = document.getElementById('editor');
    const resetButton = document.getElementById('reset-button');
    const saveButton = document.getElementById('save-button');

    let fontsData;
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
            option.textContent = variant.replace('italic', ' Italic');
            fontWeightSelector.appendChild(option);
        });
    }

    function updateFont() {
        const fontFamily = fontFamilySelector.value;
        const fontWeight = fontWeightSelector.value.replace(' Italic', 'italic');
        const italic = italicToggle.classList.contains('active') ? 'italic' : 'normal';

        if (fontFamily) {
            let fontUrl = fontsData[fontFamily].url;
            let link = document.querySelector(`link[href*="${fontUrl}"]`);
            if (!link) {
            link = document.createElement('link');
            link.href = fontUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            }
            editor.style.fontFamily = fontFamily;
            editor.style.fontWeight = fontWeight.replace('italic', '') || 'normal';
            editor.style.fontStyle = italic;
        }
    }

    function loadSavedSettings() {
        const savedText = localStorage.getItem('editorText');
        const savedFontFamily = localStorage.getItem('editorFontFamily');
        const savedFontWeight = localStorage.getItem('editorFontWeight');
        const savedItalic = localStorage.getItem('editorItalic') === 'true';

        if (savedText) editor.value = savedText;
        if (savedFontWeight) fontWeightSelector.value = savedFontWeight;
        if (savedItalic) italicToggle.classList.add('active');
        if (savedFontFamily) {
            fontFamilySelector.value = savedFontFamily;
            populateFontWeightSelector(fontsData[savedFontFamily].variants);
            fontWeightSelector.disabled = false;
            italicToggle.disabled = false;
        }
        updateFont();
    }

    function saveSettings() {
        localStorage.setItem('editorText', editor.value);
        localStorage.setItem('editorFontFamily', fontFamilySelector.value);
        localStorage.setItem('editorFontWeight', fontWeightSelector.value);
        localStorage.setItem('editorItalic', italicToggle.classList.contains('active'));
    }

    function resetSettings() {
        editor.value = '';
        fontFamilySelector.value = '';
        fontWeightSelector.innerHTML = '<option value="">Select Font Weight</option>';
        italicToggle.classList.remove('active');

        editor.style.fontFamily = '';
        editor.style.fontWeight = '';
        editor.style.fontStyle = '';

        localStorage.removeItem('editorText');
        localStorage.removeItem('editorFontFamily');
        localStorage.removeItem('editorFontWeight');
        localStorage.removeItem('editorItalic');
    }

    fontFamilySelector.addEventListener('change', function() {
        const selectedFont = fontFamilySelector.value;
        if (selectedFont) {
            populateFontWeightSelector(fontsData[selectedFont].variants);
            fontWeightSelector.disabled = false;
            italicToggle.disabled = false;
        } else {
            fontWeightSelector.disabled = true;
            italicToggle.disabled = true;
        }
        updateFont();
        saveSettings();
    });

    fontWeightSelector.addEventListener('change', function() {
        const selectedFont = fontFamilySelector.value;
        const selectedWeight = fontWeightSelector.value.replace(' Italic', 'italic');
        italicToggle.disabled = !fontsData[selectedFont].variants.includes(selectedWeight);
        updateFont();
        saveSettings();
    });

    italicToggle.addEventListener('click', function() {
        italicToggle.classList.toggle('active');
        updateFont();
        saveSettings();
    });

    editor.addEventListener('input', saveSettings);
    editor.addEventListener('change', saveSettings);

    fontFamilySelector.addEventListener('change', saveSettings);
    fontWeightSelector.addEventListener('change', saveSettings);

    resetButton.addEventListener('click', resetSettings);
    saveButton.addEventListener('click', function()
    {
        saveSettings(true);
        alert("Settings have been saved successfully!");
    });
});
