package routes

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const BASE_FILE_UPLOAD_ROUTE = "/file-upload"

type FileUploadRoutes struct {
}

func NewFileUploadRoutes() *FileUploadRoutes {
	return &FileUploadRoutes{}
}

func (route *FileUploadRoutes) RegisterFileUploadRoutes(r *gin.Engine) {
	r.POST(BASE_FILE_UPLOAD_ROUTE, route.uploadFile)
}

func (route *FileUploadRoutes) uploadFile(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")

	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("file err : %s", err.Error()))
		return
	}

	fileExt := filepath.Ext(header.Filename)
	fileName := strings.TrimSuffix(filepath.Base(header.Filename), filepath.Ext(header.Filename))
	now := time.Now()
	filenameWithoutExtraSpace := strings.ReplaceAll(fileName, "  ", "")
	filenameReplaceSpaceWithUnderscore := strings.ReplaceAll(filenameWithoutExtraSpace, " ", "_")
	filenameToSave := fmt.Sprintf("%s-[%v]%s", filenameReplaceSpaceWithUnderscore, now.Unix(), fileExt)

	out, err := os.Create("assets/user-uploads/" + filenameToSave)
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		log.Fatal(err)
	}

	c.String(http.StatusOK, fmt.Sprintf("File name: %s", filenameToSave))
}
