function getSkills() {
    let url = `${base_url}skills/get_skills/?sort_by=title`;
    fetch(url)
    .then(res => {return res.json()})
    .then(data => {
      //console.log(data);
      $('.skill-filter').empty()
      if(data['status'] == 'success') {
        if(data.data) {
            d = data.data
            for(var i in d) {
                var temp = `
                <option value="${d[i].id}">${d[i].title}</option>`;
                $('.skill-filter').append(temp)
            }
            $('.skill-filter').prepend(`<option selected value="">All SKills</option>`)
        }
      }
      else if(data['status'] == 'error') {
        $('.skill-filter').append(data.message)
      }
    })
    .catch(err => {
        console.log(err)
        getSkills()
    })
  }

  getSkills()

function getCourses() {
    skill = ""
    skill_id = $('.skill-filter').val()
    search = $('.course-search').val()
    if(skill_id.trim() !== "") {
        skill = `&skill_id=${skill_id}`
    }
    let url = `${base_url}courses/get_courses/?search=${search}${skill}`;
    fetch(url)
    .then(res => {return res.json()})
    .then(data => {
      //console.log(data);
      $('.course-row').empty()
      if(data['status'] == 'success') {
        if(data.data) {
            d = data.data
            for(var i in d) {
                var temp = `<tr>
                <td>${Number(i)+1}</td>
                <td>${d[i].title}</td>
                <td>
                    <a data-id="${d[i].id}" class="course-edit w-text-blue"><i class="fa fa-edit"></i> Edit&nbsp;&nbsp;
                    <a data-id="${d[i].id}" class="course-content w-text-green"><i class="fa fa-eye"></i> Contents&nbsp;&nbsp;
                </td>
                </tr>`;
                $('.course-row').append(temp)
            }

            $('.course-content').click(function() {
                let id = $(this).data('id')
                $('.sel_c_con').addClass('active')
                getMaterials(id)
                getVideos(id)
            })
        }
        else {
            var temp = `<tr>
            <td colspan="4">${data.message}</td>
            </tr>`
            $('.course-row').append(temp)
        }
      }
      else if(data['status'] == 'error') {
        $('.course-row').append(data.message)
      }
    })
    .catch(err => {
        console.log(err)
        getCourses()
    })
  }
  getCourses();

  function getMaterials(id) {
    let url = `${base_url}courses/get_materials/?course_id=${id}`;
    fetch(url)
    .then(res => {return res.json()})
    .then(data => {
      //console.log(data);
      $('.mat-row').empty()
      if(data['status'] == 'success') {
        if(data.data) {
            d = data.data
            for(var i in d) {
                var temp = `
                <tr class="q-item m-active" data-id="${d[i].id}">
                    <td><i class="w-text-red fa fa-certificate"></i>&nbsp;&nbsp;${d[i].topic.title}<td>
                    <td><i class="fa fa-chevron-right"></i></td>
                </tr>`;
                $('.mat-row').append(temp)
            }
            $('.m-active').click(function() {
                let id = $(this).data('id')
                $('.mat_c_con').addClass('active')
                getMaterial(id)
            })
        }
        else {
            let temp = `
            <tr>
                <td colspan="2">${data.message}</td>
            </tr>`
            $('.mat-row').append(temp)
        }
      }
      else if(data['status'] == 'error') {
        let temp = `
            <tr>
                <td colspan="2">${data.message}</td>
            </tr>`
            $('.mat-row').append(temp)
      }
    })
    .catch(err => {
        console.log(err)
        swal("Error", "Please check your internet connection", "error")
    })
  }

  function getVideos(id) {

  }

  function getMaterial(id) {
    let url = `${base_url}courses/get_material/?material_id=${id}`;
    let con = `<div class="loader">
            <div class="ball"></div>
            <div class="ball"></div>
            <div class="ball"></div>
            <div class="ball"></div>
        </div>`
    $('.mat-content').html(con)
    $('.mat-title').empty()
    fetch(url)
    .then(res => {return res.json()})
    .then(data => {
        $('.mat-content').empty()
      //console.log(data);
      if(data['status'] == 'success') {
        d = data.data
        $('.mat-title').html(d.topic.title);
        $('.save-material-btn').data('id', d.id)
        tinymce.activeEditor.setContent(d.content)
      }
      else if(data['status'] == 'error') {
        swal('Error', data.message, 'error')
      }
    })
    .catch(err => {
        console.log(err)
        swal("Error", "Please check your internet connection", "error")
    })
  }
  
  function editMaterial(id) {
    let url = `${base_url}courses/edit_material/`;
    const formData = new FormData()
    formData.append('api_token', localStorage.api_key)
    formData.append('material_id', id)
    let content = tinymce.activeEditor.getContent({format: 'html'})
    formData.append('content', content)
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => {return res.json()})
    .then(data => {
        console.log(data);
        swal(data.status, data.message, data.status)
    })
    .catch(err => {
        console.log(err)
    })
  }

function readFile() {
    let reader = new FileReader();
    let file = document.querySelector('#pro-img2').files[0];
    reader.onload = function(e) {
        document.querySelector('.emp_image').src = e.target.result;
    }
    reader.readAsDataURL(file);
}



function initiateTiny() {
    tinymce.init({
        selector: '.html-text',
        setup: function(editor) {
            editor.on('init', function(e) {
                editor.setContent("Loading content...")
            })
        },
        plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker linkchecker a11ychecker tinycomments autocorrect typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | tinycomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Admin',
        mergetags_list: [
            {value: 'First.Name', title: 'First Name'},
            {value: 'Email', title: 'Email'},
        ]
    });
}
initiateTiny();
